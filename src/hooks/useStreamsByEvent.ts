/**
 * useStreamsByEvent — Discover streams sent by the current account.
 *
 * Since Stream<T> is a shared object (not owned), we discover streams
 * by querying StreamCreated events where sender === address.
 */

import { useQuery } from '@tanstack/react-query';
import { useCurrentAccount, useCurrentClient } from '@mysten/dapp-kit-react';
import { POLL_INTERVAL_MS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';

export interface StreamSummary {
  streamId: string;
  sender: string;
  recipient: string;
  flowRate: bigint;
  initialBalance: bigint;
  coinType: string;
  createdAt: number;
}

export function useStreamsByEvent() {
  const account = useCurrentAccount();
  const client = useCurrentClient();

  return useQuery({
    queryKey: streamKeys.sent(account?.address ?? ''),
    enabled: !!account,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,

    queryFn: async (): Promise<StreamSummary[]> => {
      if (!account) return [];

      const events = await client.queryEvents({
        query: {
          MoveEventType: `${PIPER_PACKAGE_ID}::stream::StreamCreated`,
        },
        limit: 50,
        order: 'descending',
      });

      return events.data
        .filter((e) => {
          const fields = e.parsedJson as Record<string, string> | undefined;
          return fields?.sender === account.address;
        })
        .map((e) => {
          const fields = e.parsedJson as Record<string, string>;
          return {
            streamId: fields.stream_id,
            sender: fields.sender,
            recipient: fields.recipient,
            flowRate: BigInt(fields.flow_rate ?? '0'),
            initialBalance: BigInt(fields.initial_balance ?? '0'),
            coinType: e.type.match(/<(.+)>/)?.[1] ?? '',
            createdAt: Number(e.timestampMs ?? 0),
          };
        });
    },
  });
}
