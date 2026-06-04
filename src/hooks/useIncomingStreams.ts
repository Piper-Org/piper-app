/**
 * useIncomingStreams — Streams where the current account is the recipient.
 */

import { useQuery } from '@tanstack/react-query';
import { useCurrentAccount, useCurrentClient } from '@mysten/dapp-kit-react';
import { POLL_INTERVAL_MS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';
import type { StreamSummary } from './useStreamsByEvent';

export function useIncomingStreams() {
  const account = useCurrentAccount();
  const client = useCurrentClient();

  return useQuery({
    queryKey: streamKeys.incoming(account?.address ?? ''),
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
          return fields?.recipient === account.address;
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
