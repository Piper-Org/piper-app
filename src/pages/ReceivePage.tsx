import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

export default function ReceivePage() {
  return (
    <motion.div key="receive" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-bold text-black mb-6">Receive</h1>
      <p className="text-slate-500">Your QR code and incoming streams will appear here.</p>
    </motion.div>
  );
}
