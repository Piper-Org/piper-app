import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import { useParams } from '@tanstack/react-router';

export default function StreamDetailPage() {
  const { id } = useParams({ from: '/stream/$id' });
  return (
    <motion.div key="stream-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-2xl font-bold text-black mb-6">Stream Detail</h1>
      <p className="text-slate-500 font-mono text-sm">{id}</p>
    </motion.div>
  );
}
