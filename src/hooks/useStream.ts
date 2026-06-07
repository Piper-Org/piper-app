/**
 * useStream — Single stream detail from on-chain shared object.
 */

import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { POLL_INTERVAL_MS } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';

export interface StreamDetail {
  id: string;
  balance: bigint;
  flowRate: bigint;
  recipient: string;
  sender: string;
  coinType: string;
  createdAt: number;
  lastTick: number;
  isRevoked: boolean;
  authorizedSpender: string | null;
  splits: Array<{ recipient: string; percent: number }>;
}

export function useStream(streamId: string | undefined) {
  const client = useCurrentClient();

  return useQuery({
    queryKey: streamKeys.detail(streamId ?? ''),
    enabled: !!streamId,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,

    queryFn: async (): Promise<StreamDetail | null> => {
      if (!streamId) return null;

      const obj = await client.getObject({
        id: streamId,
        options: { showContent: true, showType: true },
      });

      if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
        return null;
      }

      const fields = obj.data.content.fields as Record<string, unknown>;

      return {
        id: streamId,
        balance: BigInt((fields.balance as string | number | bigint) ?? '0'),
        flowRate: BigInt((fields.flow_rate as string | number | bigint) ?? '0'),
        recipient: String(fields.recipient ?? ''),
        sender: String(fields.sender ?? ''),
        coinType: obj.data.type?.match(/<(.+)>/)?.[1] ?? '',
        createdAt: Number(fields.created_at ?? 0),
        lastTick: Number(fields.last_tick_at ?? 0),
        isRevoked: !(Boolean(fields.is_active ?? true)),
        authorizedSpender: fields.authorized_spender ? String(fields.authorized_spender) : null,
        splits: ((fields.splits as Array<Record<string, unknown>>) ?? []).map(
          (s) => ({
            recipient: String(s.recipient ?? ''),
            percent: Number(s.percent ?? 0),
          }),
        ),
      };
    },
  });
}
