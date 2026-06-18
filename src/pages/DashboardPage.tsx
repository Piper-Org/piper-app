import { useMemo, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { pageVariants } from '@/lib/motion';
import { StreamCard } from '@/components/stream/StreamCard';
import { StreamListRow } from '@/components/stream/StreamListRow';
import { NetWorthHeader } from '@/components/stream/NetWorthHeader';
import { useStreamsByEvent } from '@/hooks/useStreamsByEvent';
import { useIncomingStreams } from '@/hooks/useIncomingStreams';
import { useMultipleStreams } from '@/hooks/useMultipleStreams';

export default function DashboardPage() {
  const [viewMode, _setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('piper_view_mode') as 'grid' | 'list') || 'grid';
  });

  const setViewMode = (mode: 'grid' | 'list') => {
    localStorage.setItem('piper_view_mode', mode);
    _setViewMode(mode);
  };
  const { data: sentStreamsEvent, isLoading: isLoadingSent } = useStreamsByEvent();
  const { data: incomingStreamsEvent, isLoading: isLoadingIncoming } = useIncomingStreams();

  // Extract all IDs
  const allStreamIds = useMemo(() => {
    const sent = sentStreamsEvent?.map((s) => s.streamId) || [];
    const incoming = incomingStreamsEvent?.map((s) => s.streamId) || [];
    return [...new Set([...sent, ...incoming])];
  }, [sentStreamsEvent, incomingStreamsEvent]);

  // Fetch live stream objects
  const { data: liveStreams, isLoading: isLoadingLive } = useMultipleStreams(allStreamIds);

  // Filter to active streams
  const activeSent = useMemo(() => {
    if (!sentStreamsEvent || !liveStreams) {
      return [];
    }
    return sentStreamsEvent.filter((event) => {
      const live = liveStreams[event.streamId];
      if (!live) {
        return false;
      }
      return !live.isRevoked && live.balance > 0n;
    });
  }, [sentStreamsEvent, liveStreams]);

  const activeIncoming = useMemo(() => {
    if (!incomingStreamsEvent || !liveStreams) return [];
    return incomingStreamsEvent.filter((event) => {
      const live = liveStreams[event.streamId];
      if (!live) return false;
      return !live.isRevoked && live.balance > 0n;
    });
  }, [incomingStreamsEvent, liveStreams]);

  const isLoading = isLoadingSent || isLoadingIncoming || isLoadingLive;

  // Map events to their actual live stream details
  const activeIncomingDetails = useMemo(() =>
    activeIncoming.map(e => liveStreams?.[e.streamId]).filter(Boolean) as any[],
    [activeIncoming, liveStreams]);

  const activeSentDetails = useMemo(() =>
    activeSent.map(e => liveStreams?.[e.streamId]).filter(Boolean) as any[],
    [activeSent, liveStreams]);

  return (
    <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <NetWorthHeader activeIncoming={activeIncomingDetails} activeSent={activeSentDetails} />

      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-black tracking-tight">Overview</h1>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </header>

      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Incoming Streams</h2>
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size={32} /></div>
        ) : activeIncoming.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 md:col-span-2">
            <p className="text-slate-500 text-sm font-medium">No active incoming streams.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeIncoming.map((stream) => {
              const liveObj = liveStreams?.[stream.streamId];
              const coinTypeStr = liveObj?.coinType || stream.coinType || '';
              return (
                <StreamCard
                  key={stream.streamId}
                  id={stream.streamId}
                  mode={stream.flowRate > 0n ? 'continuous' : 'onDemand'}
                  coin={coinTypeStr.toUpperCase().includes('USDC') ? 'USDC' : 'SUI'}
                  status="active"
                  counterpartyAddress={stream.sender}
                  isIncoming={true}
                  totalAmount={stream.initialBalance}
                  currentBalance={liveObj?.balance ?? stream.initialBalance}
                  flowRate={stream.flowRate}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                {activeIncoming.map((stream) => {
                  const liveObj = liveStreams?.[stream.streamId];
                  const coinTypeStr = liveObj?.coinType || stream.coinType || '';
                  return (
                    <StreamListRow
                      key={stream.streamId}
                      id={stream.streamId}
                      mode={stream.flowRate > 0n ? 'continuous' : 'onDemand'}
                      coin={coinTypeStr.toUpperCase().includes('USDC') ? 'USDC' : 'SUI'}
                      status="active"
                      counterpartyAddress={stream.sender}
                      isIncoming={true}
                      totalAmount={stream.initialBalance}
                      currentBalance={liveObj?.balance ?? stream.initialBalance}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Outgoing Streams</h2>
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size={32} /></div>
        ) : activeSent.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 md:col-span-2">
            <p className="text-slate-500 text-sm font-medium">No active outgoing streams.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSent.map((stream) => {
              const liveObj = liveStreams?.[stream.streamId];
              const coinTypeStr = liveObj?.coinType || stream.coinType || '';
              return (
                <StreamCard
                  key={stream.streamId}
                  id={stream.streamId}
                  mode={stream.flowRate > 0n ? 'continuous' : 'onDemand'}
                  coin={coinTypeStr.toUpperCase().includes('USDC') ? 'USDC' : 'SUI'}
                  status="active"
                  counterpartyAddress={stream.recipient}
                  isIncoming={false}
                  totalAmount={stream.initialBalance}
                  currentBalance={liveObj?.balance ?? stream.initialBalance}
                  flowRate={stream.flowRate}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                {activeSent.map((stream) => {
                  const liveObj = liveStreams?.[stream.streamId];
                  const coinTypeStr = liveObj?.coinType || stream.coinType || '';
                  return (
                    <StreamListRow
                      key={stream.streamId}
                      id={stream.streamId}
                      mode={stream.flowRate > 0n ? 'continuous' : 'onDemand'}
                      coin={coinTypeStr.toUpperCase().includes('USDC') ? 'USDC' : 'SUI'}
                      status="active"
                      counterpartyAddress={stream.recipient}
                      isIncoming={false}
                      totalAmount={stream.initialBalance}
                      currentBalance={liveObj?.balance ?? stream.initialBalance}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </motion.div>
  );
}
