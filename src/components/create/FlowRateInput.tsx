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

      <div className="space-y-4">
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Flow Rate (per second)</label>
            <div className="relative">
              <Input 
                type="number" 
                placeholder="0.00" 
                className="text-lg py-6 pl-4 pr-16 font-mono font-semibold"
                value={draft.flowRatePerSec}
                onChange={(e) => updateDraft({ flowRatePerSec: e.target.value })}
              />
              <div className="absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-400">
                {draft.coinSymbol}/s
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
