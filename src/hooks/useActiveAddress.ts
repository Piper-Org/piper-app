import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { useZkLogin } from '@mysten/enoki/react';

export function useActiveAddress(): string | undefined {
  const { address: zkLoginAddress } = useZkLogin();
  const currentAccount = useCurrentAccount();
  return zkLoginAddress || currentAccount?.address;
}
