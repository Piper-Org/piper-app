import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { usePiperTx } from '@/hooks/usePiperTx';
import { txToast } from '@/components/common/TxToast';
import { Transaction } from '@mysten/sui/transactions';
import { Piper } from '@usepiper/sdk';

interface PayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamId: string;
  coinType: string;
  coinSymbol: string;
  decimals: number;
  streamBalance: bigint;
}

export function PayDialog({ open, onOpenChange, streamId, coinType, coinSymbol, decimals, streamBalance }: PayDialogProps) {
  const [amount, setAmount] = useState('');
  const { execute, isPending } = usePiperTx({ streamId, onSuccess: () => onOpenChange(false) });

  const rawAmount = amount ? BigInt(Math.floor(Number(amount) * Math.pow(10, decimals))) : 0n;
  const isExceedingBalance = rawAmount > streamBalance;

  const maxAvailableDisplay = (Number(streamBalance) / Math.pow(10, decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 });

  const handlePay = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || isExceedingBalance) return;

    try {
      
      const tx = new Transaction();
      Piper.pay(tx, {
        streamId,
        coinType,
        amount: rawAmount,
      });

      await execute(tx);
    } catch (err: any) {
      if (err.message !== 'User rejected transaction') {
        console.error('Failed to execute pay:', err);
        txToast.error('Transaction Failed', err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90vw] mx-auto rounded-3xl p-6 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="text-xl font-bold tracking-tight">Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the exact amount of {coinSymbol} you want to pull from this stream.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Amount
            </label>
            <div className="relative">
              <Input 
                type="number"
                min="0"
                step="any"
                placeholder="0.00" 
                className="text-lg py-6 font-mono font-semibold pr-16"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold uppercase tracking-wider text-sm">
                {coinSymbol}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold">
              <span className={isExceedingBalance ? "text-rose-500" : "text-slate-400"}>
                {isExceedingBalance ? "Amount exceeds available balance" : `Available: ${maxAvailableDisplay} ${coinSymbol}`}
              </span>
              <button 
                onClick={() => setAmount((Number(streamBalance) / Math.pow(10, decimals)).toString())}
                className="text-emerald-500 hover:text-emerald-600 uppercase tracking-wider"
              >
                Max
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              disabled={isPending || !amount || Number(amount) <= 0 || isExceedingBalance}
              onClick={handlePay}
              className="w-full bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed text-lg shadow-md"
            >
              {isPending ? 'Withdrawing...' : 'Withdraw'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
