/**
 * useStreamEvents — Full event history for a single stream.
 */

import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { POLL_INTERVAL_MS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';

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
  const client = useCurrentClient();

  return useQuery({
    queryKey: streamKeys.events(streamId ?? ''),
    enabled: !!streamId,
    refetchInterval: POLL_INTERVAL_MS,

    queryFn: async (): Promise<PiperEvent[]> => {
      if (!streamId) return [];

      const events = await client.queryEvents({
        query: {
          MoveEventField: {
            path: '/stream_id',
            value: streamId,
          },
        },
        limit: 100,
        order: 'descending',
      });

      // Map raw events to typed PiperEvent union
      return events.data.map((e) => {
        const typeName = e.type.split('::').pop() ?? '';
        const data = e.parsedJson as Record<string, unknown>;
        const timestampMs = Number(e.timestampMs ?? 0);
        const knownTypes: PiperEventType[] = [
          'StreamCreated', 'PaymentSent', 'StreamRevoked',
          'StreamToppedUp', 'SplitPaymentSent', 'SplitAdded', 'SplitRemoved',
        ];
        const type: PiperEventType = knownTypes.includes(typeName as PiperEventType)
          ? (typeName as PiperEventType)
          : 'PaymentSent';
        return { type, timestampMs, data };
      });
    },
  });
}
