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
import { useZkLogin, useEnokiFlow } from '@mysten/enoki/react';
import type { Transaction } from '@mysten/sui/transactions';
import { streamKeys } from '@/lib/queryKeys';
import { txToast } from '@/components/common/TxToast';
import { NETWORK } from '@/lib/constants';
import { useEnokiTxStore } from '@/store/useEnokiTxStore';

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
  const { address: zkLoginAddress } = useZkLogin();
  const enokiFlow = useEnokiFlow();
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (tx: Transaction) => {
      setIsPending(true);
      setError(null);
      
      let toastId: string | number | undefined;
      
      try {
        let result;
        
        if (zkLoginAddress) {
          // Request user approval via our global modal first
          const approved = await useEnokiTxStore.getState().requestApproval(tx);
          if (!approved) {
            setIsPending(false);
            throw new Error('User rejected transaction');
          }

          toastId = txToast.loading('Executing transaction...', 'Processing via Enoki...');
          
          try {
            // Execute using Enoki Keypair
            const keypair = await enokiFlow.getKeypair({ network: NETWORK as any });
            tx.setSender(zkLoginAddress);
            result = await client.signAndExecuteTransaction({
              transaction: tx,
              signer: keypair,
            }) as any;
            
            txToast.dismiss(toastId);
          } catch (err) {
            txToast.dismiss(toastId);
            throw err;
          }
        } else {
          // Execute using standard dAppKit (the wallet extension handles its own approval popup)
          toastId = txToast.loading('Executing transaction...', 'Please approve the request in your wallet.');
          
          try {
            result = await dAppKit.signAndExecuteTransaction({ 
              transaction: tx
            }) as any;
            txToast.dismiss(toastId);
          } catch (err) {
            txToast.dismiss(toastId);
            throw err;
          }
        }

        // Check for failure in some formats
        if (result.$kind === 'FailedTransaction') {
          throw new Error(
            `Transaction failed: ${result.FailedTransaction?.error ?? 'unknown error'}`,
          );
        }

        // Safely extract digest
        const digest = result?.digest || result?.Transaction?.digest;
        if (!digest) throw new Error(`No transaction digest returned: ${JSON.stringify(result)}`);

        // Wait for fullnode indexing before invalidating cache (with timeout to prevent hanging)
        try {
          await client.waitForTransaction({ digest, timeout: 5000 });
        } catch (waitErr) {
          console.warn('waitForTransaction timed out or failed, but tx may have succeeded:', waitErr);
        }

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

        const networkStr = client.network === 'testnet' ? 'testnet' : 'mainnet';
        const explorerUrl = `https://suiscan.xyz/${networkStr}/tx/${digest}`;
        txToast.success('Transaction Successful!', 'Your action has been confirmed on the Sui blockchain.', explorerUrl);
        if (toastId) txToast.dismiss(toastId as string);

        options.onSuccess?.(digest);
        return digest;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        txToast.error('Transaction Failed', e.message);
        if (toastId) txToast.dismiss(toastId as string);
        options.onError?.(e);
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    [dAppKit, client, queryClient, options, zkLoginAddress, enokiFlow],
  );

  return { execute, isPending, error };
}
