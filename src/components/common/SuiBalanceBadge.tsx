import { useCurrentClient } from '@mysten/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';

interface SuiBalanceBadgeProps {
  address: string;
}

export function SuiBalanceBadge({ address }: SuiBalanceBadgeProps) {
  const suiClient = useCurrentClient();
  
  const { data, isPending } = useQuery({
    queryKey: ['getBalance', address],
    queryFn: () => suiClient.getBalance({ owner: address, coinType: '0x2::sui::SUI' }),
    enabled: !!suiClient && !!address,
  });

  if (isPending || !data) {
    return (
      <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
    );
  }

  const balance = Number(data.totalBalance) / 1e9;

  return (
    <div className="flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-subtle">
      <span className="text-sm font-semibold font-mono tracking-tight text-slate-900">
        {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
      </span>
      <span className="ml-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
        SUI
      </span>
    </div>
  );
}
