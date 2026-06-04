import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

export default function CreateStreamPage() {
  return (
    <motion.div key="create" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-bold text-black mb-6">Create Stream</h1>
      <p className="text-slate-500">Stream wizard coming soon.</p>
    </motion.div>
  );
}
