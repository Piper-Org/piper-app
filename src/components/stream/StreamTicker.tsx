import { useEffect, useState } from 'react';
import { useTickerStore } from '@/store/useTickerStore';
import { CoinSymbol, SUPPORTED_COINS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StreamTickerProps {
  streamId: string;
  coinSymbol: CoinSymbol;
  mode?: 'remaining' | 'earned';
  className?: string;
  /** Initial fallback value before the store syncs */
  fallbackBalance?: bigint;
}

export function StreamTicker({ 
  streamId, 
  coinSymbol, 
  mode = 'remaining', 
  className,
  fallbackBalance 
}: StreamTickerProps) {
  const getOptimistic = useTickerStore((s) => s.getOptimistic);
  const coin = SUPPORTED_COINS[coinSymbol];
  
  const [displayValue, setDisplayValue] = useState<number>(() => {
    if (fallbackBalance !== undefined) {
      return Number(fallbackBalance) / Math.pow(10, coin.decimals);
    }
    return 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const raw = getOptimistic(streamId, mode);
      if (raw !== null) {
        setDisplayValue(Number(raw) / Math.pow(10, coin.decimals));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [streamId, getOptimistic, coin.decimals, mode]);

  return (
    <span className={cn("font-mono tabular-nums tracking-tight font-semibold", className)}>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: Math.min(4, coin.decimals),
        maximumFractionDigits: Math.min(6, coin.decimals),
      })}
      <span className="ml-1 text-[0.8em] text-slate-500 font-sans font-medium">{coin.symbol}</span>
    </span>
  );
}
