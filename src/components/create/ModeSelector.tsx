import { motion } from 'framer-motion';
import { useWizardStore } from '@/store/useWizardStore';
import { STREAM_MODES, StreamMode } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { slideLeft } from '@/lib/motion';

export function ModeSelector() {
  const { draft, updateDraft } = useWizardStore();

  const handleSelect = (mode: StreamMode) => {
    updateDraft({ mode });
  };

  const modes: StreamMode[] = ['continuous', 'onDemand'];

  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">What kind of stream?</h2>
        <p className="text-slate-500 mt-2 text-sm">Choose how you want to distribute funds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const m = STREAM_MODES[mode];
          const isSelected = draft.mode === mode;

          return (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(mode)}
              className={cn(
                "relative flex flex-col text-left p-5 rounded-2xl border-2 transition-all duration-200",
                isSelected 
                  ? "border-emerald-500 bg-emerald-50/50 shadow-elevated" 
                  : "border-slate-100 bg-white hover:border-slate-200 shadow-subtle"
              )}
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3 className="font-bold text-slate-900 mb-1">{m.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {mode === 'continuous' && "Stream money by the second. Perfect for payroll, subscriptions, or vests."}
                {mode === 'onDemand' && "Pre-approve an allowance. The recipient can pull funds whenever they want."}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
