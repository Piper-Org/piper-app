import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import { useStreamsByEvent } from '@/hooks/useStreamsByEvent';
import { useIncomingStreams } from '@/hooks/useIncomingStreams';
import { HistoryStreamRow } from '@/components/stream/HistoryStreamRow';

export default function HistoryPage() {
  const { data: sentStreams, isLoading: isLoadingSent } = useStreamsByEvent();
  const { data: incomingStreams, isLoading: isLoadingIncoming } = useIncomingStreams();

  const allStreams = useMemo(() => {
    const sent = (sentStreams || []).map(s => ({ ...s, isIncoming: false }));
    const incoming = (incomingStreams || []).map(s => ({ ...s, isIncoming: true }));
    return [...sent, ...incoming].sort((a, b) => b.createdAt - a.createdAt);
  }, [sentStreams, incomingStreams]);

  const isLoading = isLoadingSent || isLoadingIncoming;

  return (
    <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-black tracking-tight">History</h1>
        <p className="text-slate-500 mt-1">All your past and present streams.</p>
      </header>

      {isLoading ? (
        <div className="text-slate-500 text-sm">Loading history...</div>
      ) : allStreams.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">No streams found in your history.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allStreams.map((stream) => (
            <HistoryStreamRow 
              key={`${stream.streamId}-${stream.isIncoming ? 'in' : 'out'}`}
              streamId={stream.streamId}
              isIncoming={stream.isIncoming}
              createdAt={stream.createdAt}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
