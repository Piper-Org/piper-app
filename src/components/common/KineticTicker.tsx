import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useInView
} from 'framer-motion';

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ITEMS = [
  "Get paid",
  "Subscription",
  "Agentic Ai",
  "Meter",
  "Payroll",
  "Vesting"
];

function TickerItem({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Negative horizontal margins create a razor-thin vertical slice in the exact center
  const isInView = useInView(ref, { margin: "0px -49% 0px -49%" });
  
  return (
    <motion.span
      ref={ref}
      animate={{
        scale: isInView ? 1.1 : 0.9,
        color: isInView ? "#0f172a" : "#cbd5e1", // slate-900 vs slate-300
        opacity: isInView ? 1 : 0.5
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-2xl md:text-5xl font-extrabold tracking-tighter shrink-0"
    >
      {children}
    </motion.span>
  );
}

export function KineticTicker() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1.5], {
    clamp: false
  });

  // We have 4 identical blocks. Each takes exactly 25% of the total flex container width.
  // Wrapping between -25% and 0% creates an infinite loop.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const directionFactor = useRef<number>(1);
  const baseVelocity = -1.5; // Moves 1.5% of container width per second

  useAnimationFrame((_, delta) => {
    // Delta is in ms. We divide by 1000 to get seconds. 
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Adjust direction based on scroll velocity direction
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1; // scrolling up -> moves right (velocity is negative)
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;  // scrolling down -> moves left
    }

    // Add speed boost based on how fast you scroll
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="w-full relative py-6 md:py-8 flex items-center overflow-hidden bg-white border-b border-slate-100">
      {/* Gradients to fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
      
      <motion.div className="flex whitespace-nowrap items-center w-max" style={{ x }}>
        {/* Render 4 identical blocks to allow seamless looping */}
        {[1, 2, 3, 4].map((blockIdx) => (
          <div key={blockIdx} className="flex shrink-0 items-center gap-8 md:gap-20 px-4 md:px-10">
            {ITEMS.map((item, idx) => (
              <TickerItem key={idx}>{item}</TickerItem>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
