import { useQuery } from '@tanstack/react-query';
import { useCurrentClient } from '@mysten/dapp-kit-react';

export function useStreamHistory(streamId: string | undefined, enabled: boolean, isExplicitlyRevoked: boolean = false) {
  const client = useCurrentClient();

  return useQuery({
    queryKey: ['streamHistory', streamId, isExplicitlyRevoked],
    enabled: !!streamId && enabled,
    retry: true,
    retryDelay: 2000,
    queryFn: async () => {
      if (!streamId) return null;
      
      // 1. Get the object's previousTransaction to find exactly what last mutated it.
      // This bypasses the notoriously slow ChangedObject transaction indexer on Sui Testnet.
      const objResult = await client.getObject({
        id: streamId,
        options: { showPreviousTransaction: true }
      });

      const previousTxDigest = objResult.data?.previousTransaction;
      if (!previousTxDigest) return null;

      // 2. Fetch the specific closing transaction, and the creation transaction.
      const [closingTxResult, creationTxResult] = await Promise.allSettled([
        client.getTransactionBlock({
          digest: previousTxDigest,
          options: { showEvents: true }
        }),
        client.queryTransactionBlocks({
          filter: { ChangedObject: streamId },
          options: { showEvents: true },
          order: 'ascending',
          limit: 1,
        })
      ]);

      const tx = closingTxResult.status === 'fulfilled' ? closingTxResult.value : null;

      const revokedEvent = tx?.events?.find(e => e.type.includes('::events::StreamRevoked'));
      
      let remainingAtClosure = 0n;
      if (revokedEvent) {
        remainingAtClosure = BigInt((revokedEvent.parsedJson as any)?.remaining_balance ?? 0);
      }

      // 3. Fallback for creationEvent
      let historicalInitialBalance = 0n;
      if (creationTxResult.status === 'fulfilled' && creationTxResult.value.data.length > 0) {
        const creationTx = creationTxResult.value.data[0];
        const createdEvent = creationTx.events?.find(e => e.type.includes('::events::StreamCreated'));
        if (createdEvent) {
          historicalInitialBalance = BigInt((createdEvent.parsedJson as any)?.initial_balance ?? 0);
        }
      }

      return {
        digest: tx?.digest ?? previousTxDigest,
        timestampMs: tx?.timestampMs,
        remainingAtClosure,
        historicalInitialBalance,
      };
    },
  });
}
