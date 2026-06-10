import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { useActiveAddress } from '@/hooks/useActiveAddress';
import { useWalletBalances } from '@/hooks/useWalletBalances';
import { txToast } from '@/components/common/TxToast';
import { formatAddress } from '@/lib/utils';
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
  const activeAddress = useActiveAddress();
  const { suiBalance, usdcBalance } = useWalletBalances();
  const client = useCurrentClient();

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
      
      let splitCoin;
      
      if (draft.coinSymbol === 'SUI') {
        [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(baseUnits)]);
      } else {
        if (!activeAddress) throw new Error("Wallet not connected");
        
        // Fetch all coins of the selected type for the user
        const coinsResult = await client.getCoins({ 
          owner: activeAddress, 
          coinType: coinDef.type 
        });
        
        const coins = coinsResult.data;
        if (coins.length === 0) throw new Error(`No ${draft.coinSymbol} coins found in your wallet.`);
        
        // Create references to all the coin objects
        const coinObjects = coins.map((c: any) => tx.object(c.coinObjectId));
        const [primaryCoin, ...restCoins] = coinObjects;
        
        // Merge them all into the first coin so we have a sufficient balance
        if (restCoins.length > 0) {
          tx.mergeCoins(primaryCoin, restCoins);
        }
        
        [splitCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(baseUnits)]);
      }

      let finalRecipient = draft.recipient;
      if (finalRecipient.endsWith('.sui')) {
        const res = await client.resolveNameServiceAddress({ name: finalRecipient });
        if (!res) throw new Error(`Could not resolve SuiNS name: ${finalRecipient}`);
        finalRecipient = res;
      }

      let finalSpender = draft.authorizedSpender || draft.recipient;
      if (finalSpender.endsWith('.sui')) {
        const res = await client.resolveNameServiceAddress({ name: finalSpender });
        if (!res) throw new Error(`Could not resolve SuiNS name: ${finalSpender}`);
        finalSpender = res;
      }

      if (draft.mode === 'continuous') {
        const rateFloat = parseFloat(draft.flowRateAmount || '0');
        const rateUnits = BigInt(Math.floor(rateFloat * Math.pow(10, coinDef.decimals)));
        
        let secondsDivisor = 1n;
        switch (draft.flowRateInterval) {
          case 'minute': secondsDivisor = 60n; break;
          case 'hour': secondsDivisor = 3600n; break;
          case 'day': secondsDivisor = 86400n; break;
          case 'month': secondsDivisor = 2592000n; break;
        }
        
        let finalRatePerSec = rateUnits / secondsDivisor;
        if (finalRatePerSec === 0n && rateUnits > 0n) {
          finalRatePerSec = 1n; // Minimum flow rate is 1 fundamental unit per sec if they requested something too small
        }
        
        const stream = Piper.createContinuousStream(tx, {
          coin: splitCoin,
          coinType: coinDef.type,
          flowRate: finalRatePerSec,
          recipient: finalRecipient
        });
        
        Piper.shareStream(tx, stream, coinDef.type);

      } else if (draft.mode === 'onDemand') {
        const stream = Piper.createOnDemandStream(tx, {
          coin: splitCoin,
          coinType: coinDef.type,
          recipient: finalRecipient,
          authorizedSpender: finalSpender
        });
        
        Piper.shareStream(tx, stream, coinDef.type);
      }

      await execute(tx);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message !== 'User rejected transaction' && !isPending) {
        txToast.error('Transaction Failed', err.message);
      }
    } finally {
      setIsBuilding(false);
    }
  };

  const coinDef = SUPPORTED_COINS[draft.coinSymbol];
  const amountFloat = parseFloat(draft.amount || '0');
  const baseUnits = BigInt(Math.floor(amountFloat * Math.pow(10, coinDef.decimals)));
  
  const activeBalance = draft.coinSymbol === 'SUI' ? suiBalance : usdcBalance;
  const isInsufficientBalance = baseUnits > activeBalance;

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
            <span className="font-bold font-mono text-slate-900">{draft.flowRateAmount} {draft.coinSymbol} / {draft.flowRateInterval}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-500">Recipient</span>
          <span className="font-mono text-xs font-semibold text-slate-900">{formatAddress(draft.recipient, 6, 4)}</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg border border-rose-200 font-medium">
          {error.message}
        </div>
      )}

      {isInsufficientBalance && (
        <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg border border-rose-200 font-medium flex items-center justify-center">
          Insufficient {draft.coinSymbol} balance
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={isLoading || isInsufficientBalance}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Confirming...' : 'Sign & Create Stream'}
      </button>
    </motion.div>
  );
}
