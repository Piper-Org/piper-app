/**
 * useIncomingStreams — Streams where the current account is the recipient.
 */

import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { POLL_INTERVAL_MS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';
import type { StreamSummary } from './useStreamsByEvent';
import { useActiveAddress } from './useActiveAddress';

export function useIncomingStreams() {
  const address = useActiveAddress();
  const client = useCurrentClient();

  return useQuery({
    queryKey: streamKeys.incoming(address ?? ''),
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
          if (!fields?.recipient) return false;
          return normalizeSuiAddress(fields.recipient).toLowerCase() === normalizedAccount.toLowerCase();
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
            transactionDigest: e.id.txDigest,
          };
        });
    },
  });
}
