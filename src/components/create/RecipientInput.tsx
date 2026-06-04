import { motion } from 'framer-motion';
import { useWizardStore } from '@/store/useWizardStore';
import { Input } from '@/components/ui/input';
import { slideLeft } from '@/lib/motion';

export function RecipientInput() {
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
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Who is receiving this?</h2>
        <p className="text-slate-500 mt-2 text-sm">Enter the Sui address of the recipient.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {draft.mode === 'onDemand' ? 'Authorized Spender Address' : 'Recipient Address'}
          </label>
          <Input 
            placeholder="0x..." 
            className="text-sm py-6 font-mono font-semibold"
            value={draft.mode === 'onDemand' ? draft.authorizedSpender : draft.recipient}
            onChange={(e) => {
              if (draft.mode === 'onDemand') {
                updateDraft({ authorizedSpender: e.target.value, recipient: e.target.value });
              } else {
                updateDraft({ recipient: e.target.value });
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
