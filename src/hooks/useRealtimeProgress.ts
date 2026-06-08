import { useState, useEffect } from 'react';
import { useTickerStore } from '@/store/useTickerStore';

/**
 * Calculates the optimistic progress percentage of a stream in real-time.
 * It updates every 1 second to keep the progress bar smoothly moving forward.
 */
export function useRealtimeProgress(streamId: string, initialBalance: bigint, currentBalance: bigint): number {
  const getOptimistic = useTickerStore((s) => s.getOptimistic);
  
  const [progress, setProgress] = useState<number>(() => {
    const optimisticEarned = getOptimistic(streamId, 'earned') ?? 0n;
    const totalFlowed = initialBalance - currentBalance + optimisticEarned;
    const safeTotal = Number(initialBalance) || 1;
    return (Number(totalFlowed) / safeTotal) * 100;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const optimisticEarned = getOptimistic(streamId, 'earned') ?? 0n;
      const totalFlowed = initialBalance - currentBalance + optimisticEarned;
      const safeTotal = Number(initialBalance) || 1;
      setProgress((Number(totalFlowed) / safeTotal) * 100);
    }, 1000); // Update once a second, CSS transition will smooth it out

    return () => clearInterval(interval);
  }, [streamId, initialBalance, currentBalance, getOptimistic]);

  return progress;
}
