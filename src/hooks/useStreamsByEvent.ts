/**
 * useStreamsByEvent — Discover streams sent by the current account.
 *
 * Since Stream<T> is a shared object (not owned), we discover streams
 * by querying StreamCreated events where sender === address.
 */

import { useQuery } from '@tanstack/react-query';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { POLL_INTERVAL_MS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';
import { suiGraphQLClient } from '@/lib/sui';
import { useActiveAddress } from './useActiveAddress';

export interface StreamSummary {
  streamId: string;
  sender: string;
  recipient: string;
  flowRate: bigint;
  initialBalance: bigint;
  coinType: string;
  createdAt: number;
  transactionDigest: string;
}

export function useStreamsByEvent() {
  const address = useActiveAddress();

  return useQuery({
    queryKey: streamKeys.sent(address ?? ''),
    enabled: !!address,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,

    queryFn: async (): Promise<StreamSummary[]> => {
      if (!address) return [];

      const res = await suiGraphQLClient.query<{
        events?: {
          nodes: Array<{
            timestamp?: string;
            contents?: {
              json?: Record<string, unknown>;
              type?: { repr?: string };
            };
            transaction?: {
              digest?: string;
            };
          }>;
        };
      }>({
        query: `
          query GetStreamCreatedEvents($type: String!) {
            events(first: 50, filter: { type: $type }) {
              nodes {
                timestamp
                contents {
                  json
                  type {
                    repr
                  }
                }
                transaction {
                  digest
                }
              }
            }
          }
        `,
        variables: {
          type: `${PIPER_PACKAGE_ID}::events::StreamCreated`,
        },
      });

      const normalizedAccount = normalizeSuiAddress(address).toLowerCase();
      const nodes = res.data?.events?.nodes ?? [];

      return nodes
        .filter((e) => {
          const fields = e.contents?.json as Record<string, string> | undefined;
          if (!fields?.sender) return false;
          return normalizeSuiAddress(fields.sender).toLowerCase() === normalizedAccount;
        })
        .map((e) => {
          const fields = e.contents?.json as Record<string, string>;
          const typeStr = e.contents?.type?.repr ?? '';
          const createdAt = e.timestamp ? new Date(e.timestamp).getTime() : 0;
          return {
            streamId: fields.stream_id,
            sender: normalizeSuiAddress(fields.sender),
            recipient: normalizeSuiAddress(fields.recipient),
            flowRate: BigInt(fields.flow_rate ?? '0'),
            initialBalance: BigInt(fields.initial_balance ?? '0'),
            coinType: typeStr.match(/<(.+)>/)?.[1] ?? '',
            createdAt,
            transactionDigest: e.transaction?.digest ?? '',
          };
        });
    },
  });
}
