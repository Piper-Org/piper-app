import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

export default function DashboardPage() {
  return (
    <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-black tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your money streams.</p>
      </header>
      
      {/* Example Fintech Card */}
      <div className="surface-card p-6 max-w-sm">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Value Locked</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-black">$0.00</span>
          <span className="text-sm font-semibold text-emerald-500">+0.00%</span>
        </div>
      </div>
    </motion.div>
  );
}
