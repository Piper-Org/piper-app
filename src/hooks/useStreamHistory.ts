import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { suiGraphQLClient } from '@/lib/sui';

export function useStreamHistory(streamId: string | undefined, enabled: boolean, isExplicitlyRevoked: boolean = false) {
  const client = useCurrentClient();

  return useQuery({
    queryKey: ['streamHistory', streamId, isExplicitlyRevoked],
    enabled: !!streamId && enabled,
    retry: true,
    retryDelay: 2000,
    queryFn: async () => {
      if (!streamId) return null;

      try {
        // 1. Try GraphQL query for object's previous transaction, timestamp, and events
        const gqlRes = await suiGraphQLClient.query<{
          object: {
            previousTransaction?: {
              digest: string;
              effects?: {
                timestamp?: string;
                events?: {
                  nodes: Array<{
                    contents?: {
                      json?: Record<string, unknown>;
                      type?: { repr?: string };
                    };
                  }>;
                };
              };
            };
          };
        }>({
          query: `
            query GetStreamHistory($id: SuiAddress!) {
              object(address: $id) {
                previousTransaction {
                  digest
                  effects {
                    timestamp
                    events {
                      nodes {
                        contents {
                          json
                          type {
                            repr
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { id: streamId },
        });

        const prevTx = gqlRes.data?.object?.previousTransaction;
        if (prevTx) {
          const events = prevTx.effects?.events?.nodes ?? [];
          const revokedEvent = events.find((e) =>
            e.contents?.type?.repr?.includes('::events::StreamRevoked'),
          );

          let remainingAtClosure = 0n;
          if (revokedEvent?.contents?.json) {
            remainingAtClosure = BigInt(
              (revokedEvent.contents.json as any).remaining_balance ?? 0,
            );
          }

          const timestampMs = prevTx.effects?.timestamp
            ? new Date(prevTx.effects.timestamp).getTime()
            : undefined;

          return {
            digest: prevTx.digest,
            timestampMs,
            remainingAtClosure,
            historicalInitialBalance: 0n,
          };
        }
      } catch (gqlErr) {
        console.warn('GraphQL streamHistory fetch failed, falling back to gRPC:', gqlErr);
      }

      // 2. Fallback to gRPC: Get previousTransaction via getObject
      try {
        const objResult = await client.getObject({
          objectId: streamId,
          include: { previousTransaction: true },
        });

        const previousTxDigest = objResult.object?.previousTransaction;
        if (!previousTxDigest) return null;

        const txResult = await client.getTransaction({
          digest: previousTxDigest,
          include: { events: true, effects: true },
        });

        if (txResult.$kind === 'Transaction') {
          const tx = txResult.Transaction;
          const revokedEvent = tx.events?.find((e) =>
            e.eventType.includes('::events::StreamRevoked'),
          );

          let remainingAtClosure = 0n;
          if (revokedEvent?.json) {
            remainingAtClosure = BigInt(
              (revokedEvent.json as any).remaining_balance ?? 0,
            );
          }

          return {
            digest: previousTxDigest,
            timestampMs: undefined,
            remainingAtClosure,
            historicalInitialBalance: 0n,
          };
        }
      } catch (grpcErr) {
        console.error('gRPC streamHistory fallback error:', grpcErr);
      }

      return null;
    },
  });
}
