import { useState } from 'react';
import { useZkLogin, useEnokiFlow } from '@mysten/enoki/react';
import { LogOut, Copy, Check, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function EnokiAccountButton() {
  const { address } = useZkLogin();
  const enokiFlow = useEnokiFlow();
  const [copied, setCopied] = useState(false);
  
  if (!address) return null;

  const handleLogout = async () => {
    try {
      await enokiFlow.logout();
      window.location.reload();
    } catch (err) {
      console.error('Failed to logout of Enoki', err);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-900 transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-subtle group">
        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
          <Wallet className="w-3 h-3" />
        </div>
        <span className="font-mono tracking-tight">{truncatedAddress}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 shadow-elevated p-1 bg-white">
        <div className="px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100 mx-1 mt-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Address</span>
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-200 text-slate-600 transition-colors bg-white border border-slate-200 shadow-sm"
              title="Copy Address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-sm font-mono font-medium text-slate-900 truncate">
            {address.slice(0, 10)}...{address.slice(-10)}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-100 my-1.5" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer rounded-lg font-semibold py-2 transition-colors mx-1"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
