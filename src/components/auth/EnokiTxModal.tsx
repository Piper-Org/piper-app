import { motion, AnimatePresence } from 'framer-motion';
import { useEnokiTxStore } from '@/store/useEnokiTxStore';
import { Fingerprint, ShieldAlert, X, AlertCircle } from 'lucide-react';
import { NETWORK } from '@/lib/constants';
import { createPortal } from 'react-dom';

export function EnokiTxModal() {
  const { isOpen, transaction, approve, reject } = useEnokiTxStore();

  if (typeof document === 'undefined') return null;

  const commandCount = transaction ? ((transaction.getData() as any)?.commands?.length ?? 1) : 1;

  return createPortal(
    <AnimatePresence>
      {isOpen && transaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={reject}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Fingerprint className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Approve Request</h2>
              </div>
              <button 
                onClick={reject}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center justify-center py-4 px-2 text-center space-y-2">
                <ShieldAlert className="w-12 h-12 text-slate-300" />
                <p className="text-slate-600 text-sm">
                  An application is requesting your Enoki wallet to sign and execute a transaction.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Network</span>
                  <span className="text-slate-900 font-bold capitalize">{NETWORK}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">PTB</span>
                  <span className="text-slate-900 font-bold">{commandCount} transaction{commandCount === 1 ? '' : 's'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Gas Fee</span>
                  <span className="text-slate-900 font-bold">Standard</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>By approving, you authorize this transaction to execute on the blockchain using your Google linked account.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 pt-0 flex gap-3">
              <button
                onClick={reject}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={approve}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors active:scale-95"
              >
                Approve
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
