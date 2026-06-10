import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWizardStore } from '@/store/useWizardStore';
import { Input } from '@/components/ui/input';
import { formatAddress } from '@/lib/utils';
import { slideLeft } from '@/lib/motion';
import { QrScannerDialog } from '@/components/common/QrScannerDialog';
import { ScanLine, CheckCircle2 } from 'lucide-react';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';

export function RecipientInput() {
  const { draft, updateDraft } = useWizardStore();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const client = useCurrentClient();

  const inputValue = draft.mode === 'onDemand' ? draft.authorizedSpender : draft.recipient;
  
  const { data: resolvedAddress, isFetching: isResolving } = useQuery({
    queryKey: ['suins', inputValue],
    enabled: inputValue.endsWith('.sui'),
    queryFn: async () => {
      const res = await client.resolveNameServiceAddress({ name: inputValue });
      return res;
    }
  });

  const handleScan = (address: string) => {
    if (draft.mode === 'onDemand') {
      updateDraft({ authorizedSpender: address, recipient: address });
    } else {
      updateDraft({ recipient: address });
    }
    setIsScannerOpen(false);
  };

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
        <p className="text-slate-500 mt-2 text-sm">Enter the recipient's Sui address or SuiNS name (e.g. name.sui).</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {draft.mode === 'onDemand' ? 'Authorized Spender Address / SuiNS' : 'Recipient Address / SuiNS'}
          </label>
          <div className="relative">
            <Input 
              placeholder="0x... or name.sui" 
              className="text-sm py-6 font-mono font-semibold pr-12"
              value={draft.mode === 'onDemand' ? draft.authorizedSpender : draft.recipient}
              onChange={(e) => {
                if (draft.mode === 'onDemand') {
                  updateDraft({ authorizedSpender: e.target.value, recipient: e.target.value });
                } else {
                  updateDraft({ recipient: e.target.value });
                }
              }}
            />
            <button
              onClick={() => setIsScannerOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors group"
              aria-label="Scan QR Code"
              title="Scan QR Code"
            >
              <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          {/* SuiNS Resolution Indicator */}
          {inputValue.endsWith('.sui') && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              {isResolving ? (
                <span className="text-slate-400">Resolving {inputValue}...</span>
              ) : resolvedAddress ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 font-bold truncate">
                    {formatAddress(resolvedAddress, 8, 6)}
                  </span>
                </>
              ) : (
                <span className="text-rose-500">Name not found or expired</span>
              )}
            </div>
          )}
        </div>
      </div>

      <QrScannerDialog 
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onScan={handleScan}
      />
    </motion.div>
  );
}
