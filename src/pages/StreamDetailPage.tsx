import { useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorCard } from '@/components/common/ErrorCard';
import { pageVariants } from '@/lib/motion';
import { useParams, useRouter } from '@tanstack/react-router';
import { useStream } from '@/hooks/useStream';
import { useActiveAddress } from '@/hooks/useActiveAddress';
import { StreamTicker } from '@/components/stream/StreamTicker';
import { StreamStatusBadge } from '@/components/stream/StreamStatusBadge';
import { StreamFlowAnimation } from '@/components/stream/StreamFlowAnimation';
import { SUPPORTED_COINS } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';
import { usePiperTx } from '@/hooks/usePiperTx';
import { formatAddress } from '@/lib/utils';
import { Transaction } from '@mysten/sui/transactions';
import { Piper } from '@usepiper/sdk';
import { PayDialog } from '@/components/stream/PayDialog';
import { useStreamsByEvent } from '@/hooks/useStreamsByEvent';
import { useIncomingStreams } from '@/hooks/useIncomingStreams';
import { useRealtimeProgress } from '@/hooks/useRealtimeProgress';
import { Progress } from '@/components/ui/progress';
import { useStreamHistory } from '@/hooks/useStreamHistory';
import { NETWORK } from '@/lib/constants';

export default function StreamDetailPage() {
  const { id } = useParams({ from: '/_app/stream/$id' });
  const router = useRouter();
  const address = useActiveAddress();
  const { data: stream, isLoading } = useStream(id);
  const { execute, isPending } = usePiperTx({ streamId: id });
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);

  const { data: sentStreams } = useStreamsByEvent();
  const { data: receivedStreams } = useIncomingStreams();

  const activeAddressStr = address?.toLowerCase();
  const isSender = activeAddressStr === stream?.sender.toLowerCase();
  const streamEvent = isSender 
    ? sentStreams?.find(s => s.streamId === id)
    : receivedStreams?.find(s => s.streamId === id);

  let status: 'active' | 'inactive' = 'active';
  if (stream?.isRevoked || stream?.balance === 0n) {
    status = 'inactive';
  }

  const { data: history } = useStreamHistory(id, status === 'inactive', !!stream?.isRevoked);

  const initialBalance = (status === 'inactive' && history?.historicalInitialBalance && history.historicalInitialBalance > 0n) 
    ? history.historicalInitialBalance 
    : (streamEvent?.initialBalance ?? stream?.balance ?? 0n);

  const progressPercent = useRealtimeProgress(id, initialBalance, stream?.balance ?? 0n);
  
  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>;
  }

  if (!stream) {
    return (
      <div className="p-4">
        <ErrorCard title="Stream not found" message="The requested stream could not be found on the Sui blockchain. It may have been destroyed or the ID is invalid." />
      </div>
    );
  }

  const isIncoming = activeAddressStr === stream.recipient.toLowerCase();
  const isAuthorizedSpender = activeAddressStr === stream.authorizedSpender?.toLowerCase();
  const isContinuous = stream.flowRate > 0n;
  const coin = stream.coinType.toUpperCase().includes('USDC') ? 'USDC' : 'SUI';
  const coinDef = SUPPORTED_COINS[coin];

  const unlocked = Math.floor((Date.now() - Number(stream.lastTick)) / 1000) * Number(stream.flowRate);
  const isFullyUnlocked = stream.flowRate > 0n && BigInt(unlocked) >= stream.balance;

  const handleTick = async () => {
    try {
      const tx = new Transaction();
      Piper.tick(tx, {
        streamId: id,
        coinType: coinDef.type,
      });
      await execute(tx);
    } catch (err) {
      console.error('Failed to tick stream:', err);
    }
  };

  const handleRevoke = async () => {
    try {
      const tx = new Transaction();
      const coin = Piper.revoke(tx, {
        streamId: id,
        coinType: coinDef.type,
      });
      tx.transferObjects([coin], address as string);
      await execute(tx);
    } catch (err) {
      console.error('Failed to revoke stream:', err);
    }
  };

  let tickLabel = 'Sync';
  if (isSender) tickLabel = 'Resolve';
  else if (isIncoming) tickLabel = 'Withdraw';
  
  const canTick = (isContinuous && (isSender || isIncoming)) || (!isContinuous && isIncoming);

  return (
    <motion.div key="stream-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.history.back()}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-black tracking-tight">Stream Info</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
            <StreamStatusBadge status={status} />
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Coin</div>
            <div className="font-bold text-slate-900">{coinDef.symbol}</div>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {status === 'inactive' 
              ? 'Total Claimed'
              : (isIncoming ? (isContinuous ? 'Earned so far' : 'Withdrawn so far') : 'Remaining Balance')}
          </div>
          <div className="text-4xl text-slate-900">
            {status === 'inactive' ? (
              <span className="font-mono tabular-nums tracking-tight font-semibold">
                {history 
                  ? (Number(initialBalance - history.remainingAtClosure) / Math.pow(10, coinDef.decimals)).toLocaleString(undefined, {
                      minimumFractionDigits: Math.min(4, coinDef.decimals),
                      maximumFractionDigits: Math.min(6, coinDef.decimals),
                    })
                  : 'Syncing...'}
                {history && <span className="ml-1 text-[0.8em] text-slate-500 font-sans font-medium">{coinDef.symbol}</span>}
              </span>
            ) : (!isContinuous && isIncoming ? (
              <span className="font-mono tabular-nums tracking-tight font-semibold">
                {(Number(initialBalance - stream.balance) / Math.pow(10, coinDef.decimals)).toLocaleString(undefined, {
                  minimumFractionDigits: Math.min(4, coinDef.decimals),
                  maximumFractionDigits: Math.min(6, coinDef.decimals),
                })}
                <span className="ml-1 text-[0.8em] text-slate-500 font-sans font-medium">{coinDef.symbol}</span>
              </span>
            ) : (
              <StreamTicker 
                streamId={id} 
                coinSymbol={coin} 
                mode={isIncoming ? 'earned' : 'remaining'}
                fallbackBalance={stream.balance}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between p-4 bg-slate-50/80 backdrop-blur-md rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Total Deposit</span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {Number(initialBalance) / Math.pow(10, coinDef.decimals)} {coinDef.symbol}
            </span>
          </div>
          <div className="flex justify-between p-4 bg-slate-50/80 backdrop-blur-md rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Percent Left</span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {status === 'inactive' 
                ? (history ? `${((Number(history.remainingAtClosure) / Number(initialBalance)) * 100).toFixed(2)}%` : 'Syncing...') 
                : `${Math.max(0, 100 - progressPercent).toFixed(2)}%`}
            </span>
          </div>
          <div className="flex justify-between p-4 bg-slate-50/80 backdrop-blur-md rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Sender</span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {stream.sender.toLowerCase() === activeAddressStr ? "Me" : formatAddress(stream.sender, 8, 6)}
            </span>
          </div>
          <div className="flex justify-between p-4 bg-slate-50/80 backdrop-blur-md rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Recipient</span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {stream.recipient.toLowerCase() === activeAddressStr ? "Me" : formatAddress(stream.recipient, 8, 6)}
            </span>
          </div>
          <div className="flex justify-between p-4 bg-slate-50/80 backdrop-blur-md rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-500">Flow Rate</span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {Number(stream.flowRate) / Math.pow(10, coinDef.decimals)} {coinDef.symbol}/s
            </span>
          </div>
          {streamEvent?.transactionDigest && (
            <div className="flex justify-between p-4 bg-slate-50/80 backdrop-blur-md rounded-xl border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Initiating Tx</span>
              <a 
                href={`https://${NETWORK}.suivision.xyz/txblock/${streamEvent.transactionDigest}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-mono font-bold text-emerald-500 hover:text-emerald-600 underline decoration-emerald-200 underline-offset-4"
              >
                {formatAddress(streamEvent.transactionDigest, 8, 6)} ↗
              </a>
            </div>
          )}
        </div>

        {status === 'active' && isContinuous && (
          <div className="mt-8 relative z-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Flow Status
            </div>
            <StreamFlowAnimation flowRate={stream.flowRate} isIncoming={isIncoming} progressPercent={progressPercent} className="h-6" />
          </div>
        )}

        {status === 'active' && !isContinuous && (
          <div className="mt-8 relative z-10">
            <div className="flex justify-between items-end mb-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Flow Status
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {Math.min(100, Math.max(0, progressPercent)).toFixed(1)}% {isIncoming ? 'Withdrawn' : 'Claimed'}
              </div>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-100" indicatorClassName="bg-emerald-500" />
          </div>
        )}

        {status === 'inactive' && (
          <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              Historical Data
              <a 
                href={`https://${NETWORK}.suivision.xyz/object/${id}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-500 hover:text-emerald-600 normal-case underline decoration-emerald-200 underline-offset-4"
              >
                View on SuiVision ↗
              </a>
            </h3>
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">
                  Unclaimed Balance
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {history 
                    ? `${(Number(history.remainingAtClosure) / Math.pow(10, coinDef.decimals))} ${coinDef.symbol}`
                    : 'Syncing...'}
                </span>
              </div>
              {history && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Time of Transaction</span>
                  <span className="text-sm font-bold text-slate-700">
                    {history.timestampMs ? new Date(Number(history.timestampMs)).toLocaleString() : 'Unknown'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interaction Buttons Section */}
      <div className="flex gap-4 relative z-10">
        {isSender && status === 'active' && (
          <button 
            disabled={isPending || isFullyUnlocked}
            onClick={handleRevoke}
            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 text-lg"
          >
            {isPending ? 'Revoking...' : (isFullyUnlocked ? 'Completed' : 'Revoke')}
          </button>
        )}

        {canTick && status === 'active' && (
          <button 
            disabled={stream.balance === 0n || isPending || unlocked <= 0}
            onClick={handleTick}
            className="flex-1 bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:bg-slate-300 text-lg shadow-md"
          >
            {isPending ? 'Processing...' : tickLabel}
          </button>
        )}

        {!isContinuous && isAuthorizedSpender && status === 'active' && (
          <button 
            disabled={stream.balance === 0n}
            onClick={() => setIsPayDialogOpen(true)}
            className="flex-1 bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:bg-slate-300 text-lg shadow-md"
          >
            Withdraw
          </button>
        )}
      </div>

      <PayDialog 
        open={isPayDialogOpen}
        onOpenChange={setIsPayDialogOpen}
        streamId={id}
        coinType={coinDef.type}
        coinSymbol={coinDef.symbol}
        decimals={coinDef.decimals}
        streamBalance={stream.balance}
      />
    </motion.div>
  );
}
