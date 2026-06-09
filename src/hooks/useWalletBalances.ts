import { useQuery } from '@tanstack/react-query';
import { useCurrentAccount, useCurrentClient } from '@mysten/dapp-kit-react';
import { SUPPORTED_COINS } from '@/lib/constants';

export function useWalletBalances() {
  const account = useCurrentAccount();
  const client = useCurrentClient();

  // 1. Fetch SUI Balance
  const { data: suiBalance, isLoading: isLoadingSui } = useQuery({
    queryKey: ['balance', 'SUI', account?.address],
    enabled: !!account?.address,
    queryFn: async () => {
      if (!account?.address) return 0n;
      const res = await client.getBalance({ owner: account.address });
      return BigInt(res.totalBalance);
    },
    refetchInterval: 10000,
  });

  // 2. Fetch USDC Balance
  const { data: usdcBalance, isLoading: isLoadingUsdc } = useQuery({
    queryKey: ['balance', 'USDC', account?.address],
    enabled: !!account?.address,
    queryFn: async () => {
      if (!account?.address) return 0n;
      const res = await client.getBalance({ 
        owner: account.address,
        coinType: SUPPORTED_COINS.USDC.type
      });
      return BigInt(res.totalBalance);
    },
    refetchInterval: 10000,
  });

  // 3. Fetch live SUI price
  const { data: suiPrice, isLoading: isLoadingPrice } = useQuery({
    queryKey: ['suiPrice'],
    queryFn: async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd');
        if (!res.ok) throw new Error('Failed to fetch price');
        const data = await res.json();
        return data.sui?.usd || 0;
      } catch (err) {
        console.error('Error fetching SUI price:', err);
        return 0; // fallback
      }
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });

  const isLoading = isLoadingSui || isLoadingUsdc || isLoadingPrice;

  return {
    suiBalance: suiBalance ?? 0n,
    usdcBalance: usdcBalance ?? 0n,
    suiPrice: suiPrice ?? 0,
    isLoading
  };
}
