import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { StreamDetail } from '@/hooks/useStream';
import { useWalletBalances } from '@/hooks/useWalletBalances';
import { SUPPORTED_COINS } from '@/lib/constants';

interface NetWorthHeaderProps {
  activeIncoming: StreamDetail[];
  activeSent: StreamDetail[];
}

export function NetWorthHeader({ activeIncoming, activeSent }: NetWorthHeaderProps) {
  const { suiBalance, usdcBalance, suiPrice, isLoading } = useWalletBalances();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden mb-8 animate-pulse">
        <div className="relative z-10">
          <div className="w-32 h-5 bg-white/10 rounded mb-3" />
          <div className="w-64 h-12 sm:h-14 bg-white/10 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-white/10 rounded-full" />
                  <div className="w-24 h-5 bg-white/10 rounded" />
                </div>
                <div className="w-40 h-8 bg-white/10 rounded mb-2" />
                <div className="w-24 h-4 bg-white/10 rounded mb-4" />
                <div className="space-y-3 pt-5 border-t border-white/10">
                  <div className="flex justify-between">
                    <div className="w-16 h-4 bg-white/10 rounded" />
                    <div className="w-20 h-4 bg-white/10 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-24 h-4 bg-white/10 rounded" />
                    <div className="w-20 h-4 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 1. Calculate the dynamic portion of SUI and USDC based on current time
  let suiDynamic = 0n;
  let usdcDynamic = 0n;

  const processStream = (stream: StreamDetail, isIncoming: boolean) => {
    const elapsedSecs = BigInt(Math.floor(Date.now() / 1000)) - BigInt(Math.floor(Number(stream.lastTick) / 1000));
    const flowedSinceTick = elapsedSecs * stream.flowRate;
    
    // The maximum that can flow is whatever the balance is
    const actualFlowed = flowedSinceTick > stream.balance ? stream.balance : flowedSinceTick;
    
    // Remaining balance is what is left in the contract
    const remaining = stream.balance - actualFlowed;
    
    // Earned (if incoming) is what has flowed since last tick
    // Wait, the recipient's total unclaimed is actualFlowed.
    // The sender's total unspent is remaining.
    const addAmount = isIncoming ? actualFlowed : remaining;

    if (stream.coinType.includes('USDC')) {
      usdcDynamic += addAmount;
    } else {
      suiDynamic += addAmount;
    }
  };

  // Run the calculation for every active stream using the current tick
  // The tickSeconds dependency forces this component to re-render every second!
  activeIncoming.forEach(s => processStream(s, true));
  activeSent.forEach(s => processStream(s, false));

  // 2. Add static wallet balances to dynamic stream balances
  const totalSuiRaw = suiBalance + suiDynamic;
  const totalUsdcRaw = usdcBalance + usdcDynamic;

  // 3. Format to Decimals
  const suiDecimals = SUPPORTED_COINS.SUI.decimals;
  const usdcDecimals = SUPPORTED_COINS.USDC.decimals;

  const totalSui = Number(totalSuiRaw) / Math.pow(10, suiDecimals);
  const totalUsdc = Number(totalUsdcRaw) / Math.pow(10, usdcDecimals);

  // 4. Calculate Fiat Total
  const fiatTotal = (totalSui * suiPrice) + totalUsdc; // USDC is $1

  return (
    <div className="bg-black text-white rounded-3xl p-8 mb-8 shadow-elevated relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Balance</h2>
        <div className="text-5xl font-bold tracking-tight mb-8">
          ${fiatTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <img src="https://cryptologos.cc/logos/sui-sui-logo.svg?v=032" alt="SUI" className="w-6 h-6 rounded-full" />
              <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Total SUI</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {totalSui.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
            <div className="text-xs text-slate-400 mb-4">
              ≈ ${(totalSui * suiPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">In Wallet</span>
                <span className="font-semibold text-slate-200">{(Number(suiBalance) / Math.pow(10, suiDecimals)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Actively Streaming</span>
                <span className="font-semibold text-emerald-400">{(Number(suiDynamic) / Math.pow(10, suiDecimals)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=032" alt="USDC" className="w-6 h-6 rounded-full" />
              <div className="flex items-center gap-1.5 relative group" tabIndex={0}>
                <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Total USDC</div>
                <div className="text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-help">
                  <Info className="w-4 h-4" />
                </div>
                
                {/* Modern Hover Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 bg-slate-800 text-slate-200 text-xs font-medium rounded-xl shadow-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none z-50 text-center border border-slate-700">
                  This is the official Circle's sui testnet USDC
                  {/* Tooltip Arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-slate-800 border-b border-r border-slate-700 rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {totalUsdc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-400 mb-4">
              ≈ ${(totalUsdc).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">In Wallet</span>
                <span className="font-semibold text-slate-200">{(Number(usdcBalance) / Math.pow(10, usdcDecimals)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Actively Streaming</span>
                <span className="font-semibold text-emerald-400">{(Number(usdcDynamic) / Math.pow(10, usdcDecimals)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Invisible element to use tick so React tracks it for re-renders */}
      <span className="hidden">{tick}</span>
    </div>
  );
}
