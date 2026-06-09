import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { pageVariants } from '@/lib/motion';
import { useStreamsByEvent } from '@/hooks/useStreamsByEvent';
import { useIncomingStreams } from '@/hooks/useIncomingStreams';
import { HistoryStreamRow } from '@/components/stream/HistoryStreamRow';
import { useMultipleStreams } from '@/hooks/useMultipleStreams';
import { Filter } from 'lucide-react';

type FilterType = 'all' | 'sent' | 'received';

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  
  const { data: sentStreams, isLoading: isLoadingSent } = useStreamsByEvent();
  const { data: incomingStreams, isLoading: isLoadingIncoming } = useIncomingStreams();

  const allStreamRefs = useMemo(() => {
    const sent = (sentStreams || []).map(s => ({ ...s, isIncoming: false }));
    const incoming = (incomingStreams || []).map(s => ({ ...s, isIncoming: true }));
    return [...sent, ...incoming].sort((a, b) => b.createdAt - a.createdAt);
  }, [sentStreams, incomingStreams]);

  const streamIds = useMemo(() => allStreamRefs.map(s => s.streamId), [allStreamRefs]);
  const { data: streamDetails, isLoading: isLoadingDetails } = useMultipleStreams(streamIds);

  const filteredStreams = useMemo(() => {
    if (!streamDetails) return [];
    
    return allStreamRefs.filter(ref => {
      const detail = streamDetails[ref.streamId];
      if (!detail) return false;
      
      // ONLY inactive streams should be in history
      const isInactive = detail.isRevoked || detail.balance === 0n;
      if (!isInactive) return false;

      // Filter by sent/received
      if (filter === 'sent' && ref.isIncoming) return false;
      if (filter === 'received' && !ref.isIncoming) return false;
      
      return true;
    });
  }, [allStreamRefs, streamDetails, filter]);

  const isLoading = isLoadingSent || isLoadingIncoming || isLoadingDetails;

  return (
    <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">History</h1>
          <p className="text-slate-500 mt-1">Your inactive and completed streams.</p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {(['all', 'sent', 'received'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${
                filter === f 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size={32} /></div>
      ) : filteredStreams.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">No inactive streams found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStreams.map((stream) => (
            <HistoryStreamRow 
              key={`${stream.streamId}-${stream.isIncoming ? 'in' : 'out'}`}
              streamId={stream.streamId}
              isIncoming={stream.isIncoming}
              createdAt={stream.createdAt}
              initialBalance={stream.initialBalance}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
