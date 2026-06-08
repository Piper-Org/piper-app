import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { POLL_INTERVAL_MS } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';
import type { StreamDetail } from './useStream';
import { useTickerStore } from '@/store/useTickerStore';

export function useMultipleStreams(streamIds: string[]) {
  const client = useCurrentClient();

  return useQuery({
    queryKey: [...streamKeys.all(), streamIds.sort().join(',')],
    enabled: streamIds.length > 0,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,

    queryFn: async (): Promise<Record<string, StreamDetail>> => {
      if (streamIds.length === 0) return {};

      // Batch fetch up to 50 objects at a time
      const objects = await client.multiGetObjects({
        ids: streamIds,
        options: { showContent: true, showType: true },
      });

      const results: Record<string, StreamDetail> = {};

      for (const obj of objects) {
        if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
          continue;
        }

        const fields = obj.data.content.fields as Record<string, unknown>;
        const id = obj.data.objectId;

        results[id] = {
          id,
          balance: BigInt((fields.balance as string | number | bigint) ?? '0'),
          flowRate: BigInt((fields.flow_rate as string | number | bigint) ?? '0'),
          recipient: String(fields.recipient ?? ''),
          sender: String(fields.sender ?? ''),
          coinType: obj.data.type?.match(/<(.+)>/)?.[1] ?? '',
          createdAt: Number(fields.created_at ?? 0),
          lastTick: Number(fields.last_tick_at ?? 0),
          isRevoked: !(Boolean(fields.is_active ?? true)),
          splits: ((fields.splits as Array<Record<string, unknown>>) ?? []).map(
            (s) => ({
              recipient: String(s.recipient ?? ''),
              percent: Number(s.percent ?? 0),
            }),
          ),
        };

        // Sync the ticker store for real-time optimistic updates
        useTickerStore.getState().sync(id, {
          balance: results[id].balance,
          flowRatePerSec: results[id].flowRate,
          lastSyncAt: results[id].lastTick,
        });
      }

      return results;
    },
  });
}
