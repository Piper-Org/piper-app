import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

export default function HistoryPage() {
  return (
    <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-bold text-black mb-6">History</h1>
      <p className="text-slate-500">Past streams will appear here.</p>
    </motion.div>
  );
}
