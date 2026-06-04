import { useZkLogin, useEnokiFlow } from '@mysten/enoki/react';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function EnokiAccountButton() {
  const { address } = useZkLogin();
  const enokiFlow = useEnokiFlow();
  
  if (!address) return null;

  const handleLogout = async () => {
    try {
      await enokiFlow.logout();
      window.location.reload();
    } catch (err) {
      console.error('Failed to logout of Enoki', err);
    }
  };

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-subtle">
        <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <User className="w-2.5 h-2.5" />
        </div>
        <span className="font-mono tracking-tight">{truncatedAddress}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl border-slate-200 shadow-elevated p-2">
        <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
          Enoki Wallet
        </DropdownMenuLabel>
        <div className="px-2 py-2 text-sm font-mono font-medium text-slate-900 break-all bg-slate-50 rounded-lg mt-1 border border-slate-100">
          {address}
        </div>
        <DropdownMenuSeparator className="bg-slate-100 my-2" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer rounded-lg font-semibold py-2 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
