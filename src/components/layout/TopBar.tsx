import { Link } from '@tanstack/react-router';
import { ConnectButton } from '@mysten/dapp-kit-react/ui';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface-base/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Wordmark logo — hidden on desktop since it's in SideNav */}
        <Link to="/" className="md:hidden text-2xl font-bold tracking-tight text-black select-none">
          piper
        </Link>
        
        {/* On desktop, keep left side empty or put breadcrumbs/page title here later */}
        <div className="hidden md:block flex-1" />

        <div className="flex items-center gap-3">
          {/* Network badge */}
          <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Testnet
          </span>

          {/* Wallet connect */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
