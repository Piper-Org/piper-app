/**
 * useStreamSubscription — Real-time event & state sync for a single stream.
 *
 * Uses Sui gRPC SubscriptionService (subscribeCheckpoints) to detect new
 * on-chain activity and invalidate TanStack Query cache.
 * Falls back silently to polling if streaming is unavailable.
 */

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { streamKeys } from '@/lib/queryKeys';

export function useStreamSubscription(streamId: string | undefined) {
  const queryClient = useQueryClient();
  const client = useCurrentClient();

  const invalidate = useCallback(() => {
    if (!streamId) return;
    queryClient.invalidateQueries({ queryKey: streamKeys.detail(streamId) });
    queryClient.invalidateQueries({ queryKey: streamKeys.events(streamId) });
    queryClient.invalidateQueries({ queryKey: streamKeys.all() });
  }, [queryClient, streamId]);

  useEffect(() => {
    if (!streamId || !client?.subscriptionService) return;

    const controller = new AbortController();
    let isCancelled = false;

    async function startSubscription() {
      try {
        const stream = client.subscriptionService.subscribeCheckpoints(
          {},
          { abort: controller.signal },
        );

        for await (const _ of stream.responses) {
          if (isCancelled) break;
          invalidate();
        }
      } catch (err: any) {
        if (!isCancelled && err?.name !== 'AbortError') {
          console.debug('gRPC subscription stream closed, relying on interval polling');
        }
      }
    }

    startSubscription();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [streamId, client, invalidate]);
}

