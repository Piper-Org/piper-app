/**
 * usePiperTx — Transaction execution hook.
 *
 * Wraps dAppKit.signAndExecuteTransaction with:
 * 1. waitForTransaction before cache invalidation
 * 2. queryClient.invalidateQueries (stream-wide)
 * 3. Typed error handling
 */

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDAppKit, useCurrentClient } from '@mysten/dapp-kit-react';
import type { Transaction } from '@mysten/sui/transactions';
import { streamKeys } from '@/lib/queryKeys';

interface UsePiperTxOptions {
  /** Optional: stream ID to invalidate on success */
  streamId?: string;
  onSuccess?: (digest: string) => void;
  onError?: (error: Error) => void;
}

export function usePiperTx(options: UsePiperTxOptions = {}) {
  const dAppKit = useDAppKit();
  const client = useCurrentClient();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (tx: Transaction) => {
      setIsPending(true);
      setError(null);

      try {
        const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

        // Check for failure
        if (result.$kind === 'FailedTransaction') {
          throw new Error(
            `Transaction failed: ${result.FailedTransaction?.error ?? 'unknown error'}`,
          );
        }

        const digest = result.Transaction?.digest;
        if (!digest) throw new Error('No transaction digest returned');

        // Wait for fullnode indexing before invalidating cache
        await client.waitForTransaction({ digest });

        // Invalidate relevant caches
        if (options.streamId) {
          await queryClient.invalidateQueries({
            queryKey: streamKeys.detail(options.streamId),
          });
          await queryClient.invalidateQueries({
            queryKey: streamKeys.events(options.streamId),
          });
        }
        // Always invalidate all streams (balance/status may have changed)
        await queryClient.invalidateQueries({ queryKey: streamKeys.all() });

        options.onSuccess?.(digest);
        return digest;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        options.onError?.(e);
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    [dAppKit, client, queryClient, options],
  );

  return { execute, isPending, error };
}
