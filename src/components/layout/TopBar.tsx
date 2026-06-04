import { Link } from '@tanstack/react-router';
import { ConnectButton } from '@mysten/dapp-kit-react/ui';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { useZkLogin } from '@mysten/enoki/react';
import { EnokiAccountButton } from '@/components/auth/EnokiAccountButton';
import { SuiBalanceBadge } from '@/components/common/SuiBalanceBadge';

export default function TopBar() {
  const { address: zkLoginAddress } = useZkLogin();
  const currentAccount = useCurrentAccount();
  
  const activeAddress = zkLoginAddress || currentAccount?.address;

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-base/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Wordmark logo — hidden on desktop since it's in SideNav */}
        <Link to="/" className="md:hidden text-2xl font-bold tracking-tight text-black select-none">
          piper
        </Link>
        
        {/* On desktop, keep left side empty or put breadcrumbs/page title here later */}
        <div className="hidden md:block flex-1" />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Network badge */}
          <span className="hidden sm:inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200 shadow-subtle">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Testnet
          </span>

          {/* SUI Balance */}
          {activeAddress && <SuiBalanceBadge address={activeAddress} />}

          {/* Wallet connect */}
          {zkLoginAddress ? (
            <EnokiAccountButton />
          ) : (
            <ConnectButton className="!text-xs !px-3 !py-1.5 !h-auto !bg-white !text-slate-900 !border !border-slate-200 !shadow-subtle hover:!bg-slate-50 transition-colors !rounded-lg !font-semibold" />
          )}
        </div>
      </div>
    </header>
  );
}
