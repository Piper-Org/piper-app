import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreamFlowAnimationProps {
  flowRate: bigint;
  isIncoming: boolean;
  progressPercent: number;
  className?: string;
}

export function StreamFlowAnimation({ flowRate, isIncoming, progressPercent, className }: StreamFlowAnimationProps) {
  if (flowRate <= 0n && progressPercent <= 0) return null;

  const clampedProgress = Math.min(100, Math.max(0, progressPercent));
  const isCompleted = clampedProgress >= 100;

  // Direction: if incoming, water flows from right (100%) to left (-100%)
  const waterDirection = isIncoming ? ["100%", "-100%"] : ["-100%", "100%"];

  return (
    <div className={cn("relative w-full h-4 rounded-full bg-slate-100/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200/60 backdrop-blur-sm", className)}>
      
      {/* The Liquid Container (fills up based on progress) */}
      <div 
        className="absolute inset-y-0 overflow-hidden transition-all duration-1000 ease-out"
        style={{ 
          width: `${clampedProgress}%`,
          // If incoming, it fills from the right side. If outgoing, from the left.
          ...(isIncoming ? { right: 0 } : { left: 0 })
        }}
      >
        {/* Liquid background tint */}
        <div className="absolute inset-0 bg-emerald-500/20" />

        {!isCompleted ? (
          <>
            {/* Fast flowing water chunks / bubbles */}
            <motion.div
              initial={{ x: waterDirection[0] }}
              animate={{ x: waterDirection[1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-y-0 w-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(16,185,129,0.4)_10px,rgba(16,185,129,0.4)_20px)]"
            />
            {/* Fast primary water core glow */}
            <motion.div
              initial={{ x: waterDirection[0] }}
              animate={{ x: waterDirection[1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-y-1 w-[150%] bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-[2px]"
            />
          </>
        ) : (
          /* Soft, slow animation for fully completed stream */
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-emerald-500 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]"
          />
        )}
      </div>

      {/* Glass pipe reflections (top and bottom highlights for 3D effect) */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-full" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-b-full" />
    </div>
  );
}
