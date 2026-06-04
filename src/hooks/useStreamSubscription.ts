/**
 * useStreamSubscription — WebSocket event subscription for a single stream.
 *
 * Subscribes to sui_subscribeEvent filtered by stream_id.
 * On any event → invalidates TanStack Query cache (never writes directly).
 *
 * WebSocket is an accelerator on top of polling — not a replacement.
 * Falls back silently to polling-only after 3 failed reconnect attempts.
 *
 * Reconnect backoff: 3s → 6s → 12s
 */

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SUI_WS_URL, WS_RECONNECT_DELAYS, PIPER_PACKAGE_ID } from '@/lib/constants';
import { streamKeys } from '@/lib/queryKeys';

export function useStreamSubscription(streamId: string | undefined) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const invalidate = useCallback(() => {
    if (!streamId) return;
    queryClient.invalidateQueries({ queryKey: streamKeys.detail(streamId) });
    queryClient.invalidateQueries({ queryKey: streamKeys.events(streamId) });
    queryClient.invalidateQueries({ queryKey: streamKeys.all() });
  }, [queryClient, streamId]);

  const connect = useCallback(() => {
    if (!streamId) return;
    if (retriesRef.current >= WS_RECONNECT_DELAYS.length) {
      // Exhausted retries — silently fall back to polling
      return;
    }

    const ws = new WebSocket(SUI_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      retriesRef.current = 0;

      // Subscribe to all Piper events for this stream
      ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_subscribeEvent',
          params: [
            {
              MoveEventField: {
                path: '/stream_id',
                value: streamId,
              },
            },
          ],
        }),
      );
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data as string);
        // Subscription confirmation — no action needed
        if (msg.id === 1) return;
        // Event notification
        if (msg.params?.result) {
          invalidate();
        }
      } catch {
        // Malformed message — ignore
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onclose = () => {
      wsRef.current = null;
      const delay = WS_RECONNECT_DELAYS[retriesRef.current] ?? null;
      if (delay !== null) {
        retriesRef.current++;
        timeoutRef.current = setTimeout(connect, delay);
      }
    };
  }, [streamId, invalidate]);

  useEffect(() => {
    if (!streamId) return;
    connect();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      wsRef.current?.close();
      wsRef.current = null;
      retriesRef.current = 0;
    };
  }, [streamId, connect]);
}
