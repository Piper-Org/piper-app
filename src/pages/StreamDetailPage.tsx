import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useStream } from '@/hooks/useStream';
import { useActiveAddress } from '@/hooks/useActiveAddress';
import { StreamTicker } from '@/components/stream/StreamTicker';
import { StreamStatusBadge } from '@/components/stream/StreamStatusBadge';
import { SUPPORTED_COINS } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';

export default function StreamDetailPage() {
  const { id } = useParams({ from: '/stream/$id' });
  const navigate = useNavigate();
  const address = useActiveAddress();
  const { data: stream, isLoading } = useStream(id);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading stream details...</div>;
  }

  if (!stream) {
    return <div className="p-8 text-center text-rose-500">Stream not found.</div>;
  }

  const activeAddressStr = address?.toLowerCase();
  const isIncoming = activeAddressStr === stream.recipient.toLowerCase();
  const isSender = activeAddressStr === stream.sender.toLowerCase();
  const coin = stream.coinType.includes('USDC') ? 'USDC' : 'SUI';
  const coinDef = SUPPORTED_COINS[coin];

  let status: 'active' | 'completed' | 'revoked' = 'active';
  if (stream.isRevoked) status = 'revoked';
  else if (stream.balance === 0n) status = 'completed';

  return (
    <motion.div key="stream-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate({ to: '..' })}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-black tracking-tight">Stream Info</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
            <StreamStatusBadge status={status} />
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Coin</div>
            <div className="font-bold text-slate-900">{coinDef.symbol}</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {isIncoming ? 'Earned so far' : 'Remaining Balance'}
          </div>
          <div className="text-4xl text-slate-900">
            <StreamTicker 
              streamId={id} 
              coinSymbol={coin} 
              mode={isIncoming ? 'earned' : 'remaining'}
              fallbackBalance={stream.balance}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Sender</span>
            <span className="text-sm font-mono font-bold text-slate-900">{stream.sender.slice(0,8)}...{stream.sender.slice(-6)}</span>
          </div>
          <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Recipient</span>
            <span className="text-sm font-mono font-bold text-slate-900">{stream.recipient.slice(0,8)}...{stream.recipient.slice(-6)}</span>
          </div>
          <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Flow Rate</span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {Number(stream.flowRate) / Math.pow(10, coinDef.decimals)} {coinDef.symbol}/s
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder for StreamActions (Phase 7) */}
      <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-2">
        {isSender && status === 'active' && (
          <button className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl transition-colors">
            Revoke
          </button>
        )}
        <button className="flex-1 bg-black hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors">
          Tick (Sync)
        </button>
      </div>
    </motion.div>
  );
}
