import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { ConnectButton } from '@mysten/dapp-kit-react/ui';
import { useZkLogin, useEnokiFlow } from '@mysten/enoki/react';
import ZkLoginButton from './ZkLoginButton';

interface WalletGateProps {
  children: React.ReactNode;
}

export default function WalletGate({ children }: WalletGateProps) {
  const currentAccount = useCurrentAccount();
  const { address: zkLoginAddress } = useZkLogin();
  const enokiFlow = useEnokiFlow();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  // Handle the OAuth redirect callback automatically
  useEffect(() => {
    if (window.location.hash.includes('id_token=')) {
      setIsProcessingAuth(true);
      enokiFlow
        .handleAuthCallback()
        .then(() => {
          // Clear the hash from the URL to keep it clean
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        })
        .catch((err) => {
          console.error('Failed to handle Enoki auth callback:', err);
        })
        .finally(() => {
          setIsProcessingAuth(false);
        });
    }
  }, [enokiFlow]);

  const isConnected = !!currentAccount || !!zkLoginAddress;

  if (isProcessingAuth) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-surface-base">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Securing your session...</p>
        </div>
      </div>
    );
  }

  // If not connected, show the login screen
  if (!isConnected) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-surface-base px-4">
        <div className="w-full max-w-md surface-card p-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-2">piper</h1>
          <p className="text-slate-500 mb-8">Connect to start streaming money.</p>

          <div className="w-full space-y-4">
            <ZkLoginButton />

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="flex justify-center w-full">
              <ConnectButton className="!w-full !bg-black !text-white !font-semibold !rounded-xl !py-3 !shadow-none hover:!bg-slate-800 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the protected application
  return <>{children}</>;
}
