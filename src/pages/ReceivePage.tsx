import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import { useActiveAddress } from '@/hooks/useActiveAddress';
import { QrCodeDisplay } from '@/components/common/QrCodeDisplay';
import { CopyAddress } from '@/components/common/CopyAddress';

export default function ReceivePage() {
  const address = useActiveAddress();

  return (
    <motion.div key="receive" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8 max-w-md mx-auto pb-20">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-black tracking-tight">Receive</h1>
        <p className="text-slate-500 mt-2">Scan this QR code or copy your address to receive streams or tokens.</p>
      </header>

      {address ? (
        <div className="space-y-6">
          <QrCodeDisplay address={address} />
          <div className="bg-white p-6 rounded-3xl shadow-elevated border border-slate-100 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Your Address</h2>
            <CopyAddress address={address} />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100">
          <p className="text-slate-500 font-medium">Please connect your wallet to view your receiving address and QR code.</p>
        </div>
      )}
    </motion.div>
  );
}
