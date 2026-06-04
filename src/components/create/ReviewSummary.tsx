import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { Transaction } from '@mysten/sui/transactions';
import { Piper } from '@usepiper/sdk';
import { useWizardStore } from '@/store/useWizardStore';
import { usePiperTx } from '@/hooks/usePiperTx';
import { SUPPORTED_COINS } from '@/lib/constants';
import { slideLeft } from '@/lib/motion';

export function ReviewSummary() {
  const { draft, reset } = useWizardStore();
  const navigate = useNavigate();
  const [isBuilding, setIsBuilding] = useState(false);

  const { execute, isPending, error } = usePiperTx({
    onSuccess: () => {
      reset();
      setTimeout(() => navigate({ to: '/' }), 1000);
    }
  });

  const handleCreate = async () => {
    setIsBuilding(true);
    try {
      const tx = new Transaction();
      const coinDef = SUPPORTED_COINS[draft.coinSymbol];
      
      const amountFloat = parseFloat(draft.amount || '0');
      const baseUnits = BigInt(Math.floor(amountFloat * Math.pow(10, coinDef.decimals)));
      
      const [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(baseUnits)]);

      if (draft.mode === 'continuous') {
        const rateFloat = parseFloat(draft.flowRatePerSec || '0');
        const rateUnits = BigInt(Math.floor(rateFloat * Math.pow(10, coinDef.decimals)));
        
        const stream = Piper.createContinuousStream(tx, {
          coin: splitCoin,
          coinType: coinDef.type,
          flowRate: rateUnits,
          recipient: draft.recipient
        });
        
        Piper.shareStream(tx, stream, coinDef.type);

      } else if (draft.mode === 'onDemand') {
        const stream = Piper.createOnDemandStream(tx, {
          coin: splitCoin,
          coinType: coinDef.type,
          recipient: draft.recipient,
          authorizedSpender: draft.authorizedSpender || draft.recipient
        });
        
        Piper.shareStream(tx, stream, coinDef.type);
      }

      await execute(tx);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBuilding(false);
    }
  };

  const isLoading = isPending || isBuilding;

  return (
    <motion.div variants={slideLeft} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Review & Confirm</h2>
        <p className="text-slate-500 mt-2 text-sm">Please verify the stream details before signing.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4 shadow-subtle">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <span className="text-sm font-semibold text-slate-500">Mode</span>
          <span className="font-bold text-slate-900 capitalize">{draft.mode === 'onDemand' ? 'On-Demand' : draft.mode}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <span className="text-sm font-semibold text-slate-500">Total Deposit</span>
          <span className="font-bold font-mono text-slate-900">{draft.amount} {draft.coinSymbol}</span>
        </div>
        {draft.mode === 'continuous' && (
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <span className="text-sm font-semibold text-slate-500">Flow Rate</span>
            <span className="font-bold font-mono text-slate-900">{draft.flowRatePerSec} {draft.coinSymbol}/s</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-500">Recipient</span>
          <span className="font-mono text-xs font-semibold text-slate-900">{draft.recipient.slice(0,6)}...{draft.recipient.slice(-4)}</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg border border-rose-200 font-medium">
          {error.message}
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={isLoading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Confirming...' : 'Sign & Create Stream'}
      </button>
    </motion.div>
  );
}
