import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import { StreamWizard } from '@/components/create/StreamWizard';

export default function CreateStreamPage() {
  return (
    <motion.div key="create" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-4">
      <StreamWizard />
    </motion.div>
  );
}
