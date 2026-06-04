/**
 * useStreamsByEvent — Discover streams sent by the current account.
 *
 * Since Stream<T> is a shared object (not owned), we discover streams
 * by querying StreamCreated events where sender === address.
 */

import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { POLL_INTERVAL_MS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';
import { useActiveAddress } from './useActiveAddress';

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
  const address = useActiveAddress();
  const client = useCurrentClient();

  return useQuery({
    queryKey: streamKeys.sent(address ?? ''),
    enabled: !!address,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,

    queryFn: async (): Promise<StreamSummary[]> => {
      if (!address) return [];

      const events = await client.queryEvents({
        query: {
          MoveEventType: `${PIPER_PACKAGE_ID}::events::StreamCreated`,
        },
        limit: 50,
        order: 'descending',
      });

      const normalizedAccount = normalizeSuiAddress(address);

      return events.data
        .filter((e) => {
          const fields = e.parsedJson as Record<string, string> | undefined;
          if (!fields?.sender) return false;
          return normalizeSuiAddress(fields.sender).toLowerCase() === normalizedAccount.toLowerCase();
        })
        .map((e) => {
          const fields = e.parsedJson as Record<string, string>;
          return {
            streamId: fields.stream_id,
            sender: normalizeSuiAddress(fields.sender),
            recipient: normalizeSuiAddress(fields.recipient),
            flowRate: BigInt(fields.flow_rate ?? '0'),
            initialBalance: BigInt(fields.initial_balance ?? '0'),
            coinType: e.type.match(/<(.+)>/)?.[1] ?? '',
            createdAt: Number(e.timestampMs ?? 0),
          };
        });
    },
  });
}
