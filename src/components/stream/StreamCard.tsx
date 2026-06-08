import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { StreamTicker } from './StreamTicker';
import { StreamStatusBadge } from './StreamStatusBadge';
import { StreamFlowAnimation } from './StreamFlowAnimation';
import { Progress } from '@/components/ui/progress';
import { STREAM_MODES, StreamMode, CoinSymbol, SUPPORTED_COINS } from '@/lib/constants';
import { useRealtimeProgress } from '@/hooks/useRealtimeProgress';

interface StreamCardProps {
  id: string;
  mode: StreamMode;
  coin: CoinSymbol;
  status: 'active' | 'inactive';
  counterpartyAddress: string;
  isIncoming: boolean;
  totalAmount: bigint;
  currentBalance: bigint;
  flowRate: bigint;
}

export function StreamCard({ 
  id, 
  mode, 
  coin, 
  status, 
  counterpartyAddress, 
  isIncoming,
  totalAmount,
  currentBalance,
  flowRate
}: StreamCardProps) {
  const modeData = STREAM_MODES[mode];
  
  // Calculate progress safely, incorporating optimistic real-time data
  const progressPercent = useRealtimeProgress(id, totalAmount, currentBalance);
  
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.05)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-5 shadow-elevated border border-slate-100 transition-shadow relative overflow-hidden group"
    >
      {/* Pulse glow if active */}
      {status === 'active' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
      )}
      
      <div className="flex justify-between items-start mb-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl shadow-subtle border border-slate-100">
            {modeData.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              {isIncoming ? 'From' : 'To'}
            </div>
            <div className="text-sm font-semibold text-slate-900 font-mono">
              {counterpartyAddress.slice(0, 6)}...{counterpartyAddress.slice(-4)}
            </div>
          </div>
        </div>
        
        <StreamStatusBadge status={status} />
      </div>
      
      <div className="mb-5 relative">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          {isIncoming ? 'Earned so far' : 'Remaining Balance'}
        </div>
        <div className="text-2xl text-slate-900">
          <StreamTicker 
            streamId={id} 
            coinSymbol={coin} 
            mode={isIncoming ? 'earned' : 'remaining'}
            fallbackBalance={currentBalance}
          />
        </div>
      </div>
      
      {mode === 'continuous' ? (
        <div className="relative z-10 pointer-events-none mt-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div className="flex items-center gap-2">
              {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              {isIncoming ? 'Incoming Flow' : 'Outgoing Flow'}
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span>{Math.min(100, Math.max(0, progressPercent)).toFixed(1)}%</span>
              <span className="text-slate-200">|</span>
              <span>{Number(totalAmount) / Math.pow(10, SUPPORTED_COINS[coin].decimals)} {SUPPORTED_COINS[coin].symbol}</span>
            </div>
          </div>
          <StreamFlowAnimation flowRate={status === 'active' ? flowRate : 0n} isIncoming={isIncoming} progressPercent={progressPercent} />
        </div>
      ) : (
        <div className="relative mt-2">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{Math.min(100, Math.max(0, progressPercent)).toFixed(1)}% Sent</span>
            <span>{Number(totalAmount) / Math.pow(10, SUPPORTED_COINS[coin].decimals)} {SUPPORTED_COINS[coin].symbol} Total</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 bg-slate-100" />
        </div>
      )}
      
      <Link 
        to={`/stream/$id`} 
        params={{ id }}
        className="absolute inset-0 z-10"
        aria-label="View stream details"
      />
    </motion.div>
  );
}
