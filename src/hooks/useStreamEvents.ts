/**
 * useStreamEvents — Full event history for a single stream.
 */

import { useQuery } from '@tanstack/react-query';
import { POLL_INTERVAL_MS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';
import { suiGraphQLClient } from '@/lib/sui';

export type PiperEventType =
  | 'StreamCreated'
  | 'PaymentSent'
  | 'StreamRevoked'
  | 'StreamToppedUp'
  | 'SplitPaymentSent'
  | 'SplitAdded'
  | 'SplitRemoved';

export interface PiperEvent {
  type: PiperEventType;
  timestampMs: number;
  data: Record<string, unknown>;
}

export function useStreamEvents(streamId: string | undefined) {
  return useQuery({
    queryKey: streamKeys.events(streamId ?? ''),
    enabled: !!streamId,
    refetchInterval: POLL_INTERVAL_MS,

    queryFn: async (): Promise<PiperEvent[]> => {
      if (!streamId) return [];

      const res = await suiGraphQLClient.query<{
        events?: {
          nodes: Array<{
            timestamp?: string;
            contents?: {
              json?: Record<string, unknown>;
              type?: { repr?: string };
            };
          }>;
        };
      }>({
        query: `
          query GetPiperEvents($module: String!) {
            events(first: 100, filter: { module: $module }) {
              nodes {
                timestamp
                contents {
                  json
                  type {
                    repr
                  }
                }
              }
            }
          }
        `,
        variables: {
          module: `${PIPER_PACKAGE_ID}::events`,
        },
      });

      const nodes = res.data?.events?.nodes ?? [];

      // Map raw events to typed PiperEvent union
      return nodes
        .map((e) => {
          const typeStr = e.contents?.type?.repr ?? '';
          const typeName = typeStr.split('::').pop()?.split('<')[0] ?? '';
          const data = (e.contents?.json as Record<string, unknown>) ?? {};
          const timestampMs = e.timestamp ? new Date(e.timestamp).getTime() : 0;
          const knownTypes: PiperEventType[] = [
            'StreamCreated',
            'PaymentSent',
            'StreamRevoked',
            'StreamToppedUp',
            'SplitPaymentSent',
            'SplitAdded',
            'SplitRemoved',
          ];
          const type: PiperEventType = knownTypes.includes(typeName as PiperEventType)
            ? (typeName as PiperEventType)
            : 'PaymentSent';
          return { type, timestampMs, data };
        })
        .filter((e) => e.data.stream_id === streamId);
    },
  });
}
