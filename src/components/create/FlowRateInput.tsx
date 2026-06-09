import { motion } from 'framer-motion';
import { useWizardStore } from '@/store/useWizardStore';
import { Input } from '@/components/ui/input';
import { slideLeft } from '@/lib/motion';

export function FlowRateInput() {
  const { draft, updateDraft } = useWizardStore();

  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Amount & Flow</h2>
        <p className="text-slate-500 mt-2 text-sm">Set the total deposit and how fast it streams.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Coin</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['SUI', 'USDC'] as const).map((coin) => (
              <button
                key={coin}
                onClick={() => updateDraft({ coinSymbol: coin })}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  draft.coinSymbol === coin 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {coin}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Deposit</label>
          <div className="relative">
            <Input 
              type="number" 
              placeholder="0.00" 
              className="text-lg py-6 pl-4 pr-16 font-mono font-semibold"
              value={draft.amount}
              onChange={(e) => updateDraft({ amount: e.target.value })}
            />
            <div className="absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-400">
              {draft.coinSymbol}
            </div>
          </div>
        </div>

        {draft.mode === 'continuous' && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Flow Rate</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="text-lg py-6 pl-4 pr-16 font-mono font-semibold"
                  value={draft.flowRateAmount}
                  onChange={(e) => updateDraft({ flowRateAmount: e.target.value })}
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-400">
                  {draft.coinSymbol}
                </div>
              </div>
              
              <div className="relative w-32">
                <select 
                  className="w-full h-full appearance-none bg-slate-100 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none border-2 border-transparent focus:border-emerald-500 transition-colors"
                  value={draft.flowRateInterval}
                  onChange={(e) => updateDraft({ flowRateInterval: e.target.value as any })}
                >
                  <option value="second">/ Second</option>
                  <option value="minute">/ Minute</option>
                  <option value="hour">/ Hour</option>
                  <option value="day">/ Day</option>
                  <option value="month">/ Month</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
