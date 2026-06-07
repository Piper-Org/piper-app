import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useStream } from '@/hooks/useStream';
import { useActiveAddress } from '@/hooks/useActiveAddress';
import { StreamTicker } from '@/components/stream/StreamTicker';
import { StreamStatusBadge } from '@/components/stream/StreamStatusBadge';
import { SUPPORTED_COINS } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';
import { usePiperTx } from '@/hooks/usePiperTx';
import { Transaction } from '@mysten/sui/transactions';
import { Piper } from '@usepiper/sdk';

export default function StreamDetailPage() {
  const { id } = useParams({ from: '/stream/$id' });
  const navigate = useNavigate();
  const address = useActiveAddress();
  const { data: stream, isLoading } = useStream(id);
  const { execute, isPending } = usePiperTx({ streamId: id });

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

  let status: 'active' | 'inactive' = 'active';
  const unlocked = Math.floor((Date.now() - Number(stream.lastTick)) / 1000) * Number(stream.flowRate);
  
  // The Move contract sets is_active to false when a stream is fully exhausted OR revoked.
  // Both states result in a balance of 0.
  if (stream.isRevoked || stream.balance === 0n || (stream.flowRate > 0n && BigInt(unlocked) >= stream.balance)) {
    status = 'inactive';
  }

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

      <div className="flex gap-4">
        {isSender && status === 'active' && (
          <button 
            disabled={isPending}
            onClick={handleRevoke}
            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-lg"
          >
            {isPending ? 'Revoking...' : 'Revoke'}
          </button>
        )}
        <button 
          disabled={stream.balance === 0n || isPending}
          onClick={handleTick}
          className="flex-1 bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:bg-slate-300 text-lg shadow-md"
        >
          {isPending ? 'Syncing...' : 'Tick (Sync)'}
        </button>
      </div>
    </motion.div>
  );
}
