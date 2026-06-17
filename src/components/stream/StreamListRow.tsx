import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { StreamTicker } from './StreamTicker';
import { StreamStatusBadge } from './StreamStatusBadge';
import { STREAM_MODES, StreamMode, CoinSymbol, SUPPORTED_COINS } from '@/lib/constants';
import { useRealtimeProgress } from '@/hooks/useRealtimeProgress';
import { formatAddress } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface StreamListRowProps {
  id: string;
  mode: StreamMode;
  coin: CoinSymbol;
  status: 'active' | 'inactive';
  counterpartyAddress: string;
  isIncoming: boolean;
  totalAmount: bigint;
  currentBalance: bigint;
}

export function StreamListRow({ 
  id, 
  mode, 
  coin, 
  status, 
  counterpartyAddress, 
  isIncoming,
  totalAmount,
  currentBalance
}: StreamListRowProps) {
  const modeData = STREAM_MODES[mode];
  const progressPercent = useRealtimeProgress(id, totalAmount, currentBalance);
  
  const navigate = useNavigate();
  
  return (
    <motion.tr
      onClick={() => navigate({ to: '/stream/$id', params: { id } })}
      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 1)' }}
      className="group border-b border-slate-100 last:border-0 relative cursor-pointer bg-white transition-colors"
    >
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg shadow-subtle border border-slate-100">
            {modeData.icon}
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isIncoming ? 'From' : 'To'}
            </div>
            <div className="text-sm font-semibold text-slate-900 font-mono">
              {formatAddress(counterpartyAddress, 5, 4)}
            </div>
          </div>
        </div>
      </td>
      
      <td className="p-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Asset</div>
        <div className="text-sm font-semibold text-slate-900">{SUPPORTED_COINS[coin].symbol}</div>
      </td>

      <td className="p-4 whitespace-nowrap">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Stream Type</div>
        <div className="text-sm font-semibold text-slate-900">{mode === 'continuous' ? 'Continuous' : 'Pay Per Use'}</div>
      </td>

      <td className="p-4 whitespace-nowrap">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
          {isIncoming ? (mode === 'continuous' ? 'Earned' : 'Withdrawn') : 'Remaining'}
        </div>
        <div className="text-sm font-bold text-slate-900">
          {mode === 'onDemand' && isIncoming ? (
            <span className="font-mono tabular-nums tracking-tight">
              {(Number(totalAmount - currentBalance) / Math.pow(10, SUPPORTED_COINS[coin].decimals)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </span>
          ) : (
            <StreamTicker 
              streamId={id} 
              coinSymbol={coin} 
              mode={isIncoming ? 'earned' : 'remaining'}
              fallbackBalance={currentBalance}
              showSymbol={false}
            />
          )}
        </div>
      </td>

      <td className="p-4 whitespace-nowrap w-32 md:w-48 hidden lg:table-cell">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          <span>Progress</span>
          <span>{Math.min(100, Math.max(0, progressPercent)).toFixed(1)}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5 bg-slate-100" indicatorClassName="bg-emerald-500" />
      </td>

      <td className="p-4 whitespace-nowrap text-right relative">
        <div className="flex justify-end items-center h-full">
          <div className="md:hidden">
            <span className={`w-2.5 h-2.5 rounded-full block ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          </div>
          <div className="hidden md:block">
            <StreamStatusBadge status={status} />
          </div>
        </div>

      </td>
    </motion.tr>
  );
}
