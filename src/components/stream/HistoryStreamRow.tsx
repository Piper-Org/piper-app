import { Link } from '@tanstack/react-router';
import { useStream } from '@/hooks/useStream';
import { StreamStatusBadge } from './StreamStatusBadge';
import { STREAM_MODES, SUPPORTED_COINS } from '@/lib/constants';

interface HistoryStreamRowProps {
  streamId: string;
  isIncoming: boolean;
  createdAt: number;
}

export function HistoryStreamRow({ streamId, isIncoming, createdAt }: HistoryStreamRowProps) {
  const { data: stream, isLoading } = useStream(streamId);

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div className="h-10 w-48 bg-slate-200 rounded"></div>
        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
      </div>
    );
  }

  if (!stream) return null;

  const mode = stream.flowRate > 0n ? 'continuous' : 'onDemand';
  const modeData = STREAM_MODES[mode];
  const coin = stream.coinType.includes('USDC') ? 'USDC' : 'SUI';
  const coinDef = SUPPORTED_COINS[coin];
  
  // Determine actual status
  let status: 'active' | 'completed' | 'revoked' = 'active';
  if (stream.isRevoked) status = 'revoked';
  else if (stream.balance === 0n) status = 'completed';

  const counterparty = isIncoming ? stream.sender : stream.recipient;
  const dateStr = new Date(createdAt).toLocaleDateString(undefined, { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return (
    <Link 
      to={`/stream/$id`}
      params={{ id: streamId }}
      className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl shadow-subtle border border-slate-100 group-hover:scale-105 transition-transform">
          {modeData.icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900 font-mono">
            {isIncoming ? 'From' : 'To'} {counterparty.slice(0, 6)}...{counterparty.slice(-4)}
          </div>
          <div className="text-xs text-slate-500">
            {dateStr} • {modeData.label}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right">
        <div className="hidden sm:block">
          <div className="text-sm font-bold text-slate-900">
            {Number(stream.balance) / Math.pow(10, coinDef.decimals)} {coinDef.symbol}
          </div>
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Remaining
          </div>
        </div>
        <StreamStatusBadge status={status} />
      </div>
    </Link>
  );
}
