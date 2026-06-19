import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ChevronRight, ChevronLeft, Droplets, Zap, ShieldCheck } from 'lucide-react';

const SLIDES = [
  // Slide 0: Title
  {
    id: "title",
    content: () => (
      <div className="flex flex-col items-center text-center max-w-5xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mb-8"
        >
          <div className="text-[80px] md:text-[120px] font-black tracking-tight text-slate-900 select-none flex items-center gap-4 leading-none pb-4">
            piper <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500 animate-pulse mt-4 shadow-[0_0_30px_rgba(16,185,129,0.8)]" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-slate-800 mb-8 tracking-tight"
        >
          Payment Streaming on Sui
        </motion.h2>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-3xl space-y-6"
        >
          <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
            While Piper enables a universe of real-time payment possibilities...
          </p>
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl shadow-sm transform transition-all hover:scale-[1.02]">
            <p className="text-2xl md:text-3xl text-emerald-800 font-bold">
              This pitch is about <span className="underline decoration-emerald-400 decoration-4 underline-offset-4">Immediate Real-World Impact</span>.
            </p>
          </div>
        </motion.div>
      </div>
    )
  },
  // Slide 1: The Problem
  {
    id: "problem",
    content: () => (
      <div className="flex flex-col items-start max-w-4xl text-left w-full px-8 md:px-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-rose-100 rounded-2xl">
            <Zap className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">The Problem: Rigid Subscriptions</h2>
        </div>
        <div className="space-y-6 text-xl text-slate-600">
          <p className="font-semibold text-2xl text-slate-800">
            Real-World Friction: Our partner (a Nigerian ISP) uses Starlink to sell internet.
          </p>
          <ul className="space-y-4 ml-6 list-disc marker:text-rose-400">
            <li>Users pay an upfront fee for a daily or monthly pass.</li>
            <li>A user might only consume 2 hours of internet that day.</li>
            <li>The pass expires, and their unused value is lost.</li>
          </ul>
          <div className="mt-8 p-6 bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 font-medium text-2xl italic border-l-4 border-l-rose-500 shadow-sm">
            "Users are forced to pay for access time rather than actual consumption, leading to high friction and dissatisfaction."
          </div>
        </div>
      </div>
    )
  },
  // Slide 2: The Solution
  {
    id: "solution",
    content: () => (
      <div className="flex flex-col items-start max-w-4xl text-left w-full px-8 md:px-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Droplets className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">The Solution: Piper</h2>
        </div>
        <p className="text-2xl font-bold text-emerald-600 mb-8">Continuous (Pay-per-second) Streaming natively on Sui</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Fluid Value</h3>
            <p className="text-slate-600 text-lg">Instead of lump-sum upfront payments, users stream tokens <i>per second</i> for exactly the internet they consume.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Total Fairness</h3>
            <p className="text-slate-600 text-lg">Use 2 hours? Stream 2 hours worth of tokens. Disconnect, and the payment stops instantly.</p>
          </div>
          <div className="bg-emerald-50 p-8 rounded-3xl shadow-inner border border-emerald-100 md:col-span-2">
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Automated Revenue</h3>
            <p className="text-emerald-800 text-lg">The ISP collects revenue in real-time without the heavy overhead of traditional micro-transaction fees.</p>
          </div>
        </div>
      </div>
    )
  },
  // Slide 3: Market
  {
    id: "market",
    content: () => (
      <div className="flex flex-col items-start max-w-4xl text-left w-full px-8 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">Market & Validation</h2>
        
        <div className="w-full space-y-6">
          <div className="flex items-start gap-6 bg-emerald-50 p-6 rounded-3xl border border-emerald-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
            <div className="text-4xl font-black text-emerald-600 shrink-0 mt-1">₦50M+</div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Real-World ISP Traction</h3>
              <p className="text-emerald-800 font-medium">
                Our partner ISP has already processed over 50 million naira (~$40k USD) and is rapidly gaining adoption among student areas previously unserved by internet coverage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="text-4xl font-black text-blue-500 shrink-0 mt-1">$6.74B</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">An Exploding Market</h3>
              <p className="text-slate-600">The broader Crypto Payment Gateway market is projected to reach $6.74 Billion by 2032 (19% CAGR).</p>
            </div>
          </div>

          <div className="flex items-start gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <ShieldCheck className="w-10 h-10 text-purple-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Proven Product-Market Fit</h3>
              <p className="text-slate-600">Payment streaming is already deeply validated in Web3 for real-time payroll and token vesting.</p>
              <div className="mt-2 inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                Our Edge: DePIN
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  // Slide 4: Blue Ocean
  {
    id: "blueocean",
    content: () => (
      <div className="flex flex-col items-start max-w-5xl text-left w-full px-8 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12">The "Blue Ocean" on Sui</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-500 uppercase tracking-wider mb-6">Established Competitors</h3>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="font-bold text-slate-900 mb-2">EVM Chains</div>
              <div className="text-slate-600">Dominated by <span className="font-semibold text-slate-800">Sablier</span> and <span className="font-semibold text-slate-800">Superfluid</span>.</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="font-bold text-slate-900 mb-2">Solana</div>
              <div className="text-slate-600">Dominated by <span className="font-semibold text-slate-800">Streamflow</span> and <span className="font-semibold text-slate-800">Zebec</span>.</div>
            </div>
          </div>
          
          <div className="bg-blue-600 text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="text-3xl font-bold mb-6 text-blue-50">The Sui Opportunity</h3>
            <p className="text-xl text-blue-100 mb-8 font-medium">
              There is currently <span className="text-white font-bold underline decoration-blue-400">no dominant, dedicated</span> payment streaming protocol natively built for consumers on Sui.
            </p>
            <div className="bg-blue-700/50 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
              <h4 className="font-bold text-xl mb-2 text-white">Why Sui is Better:</h4>
              <p className="text-blue-100 leading-relaxed">
                Sub-second finality, parallel execution, and Programmable Transaction Blocks (PTBs) make it technically superior for the high-frequency micro-state changes required in real-time streaming.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  // Slide 5: The Ask
  {
    id: "ask",
    content: () => (
      <div className="flex flex-col items-center text-center max-w-4xl w-full px-8 md:px-0">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">The Ask</h2>
        <div className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-xl shadow-emerald-500/20 mb-12 transform -rotate-2 hover:rotate-0 transition-transform">
          We are asking for the Hackathon Top Prize.
        </div>
        
        <p className="text-2xl text-slate-600 font-medium mb-12 max-w-3xl">
          This isn't just an idea; we have an active B2B partner waiting to integrate. 100% of the funds will be used for:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Security</h3>
            <p className="text-slate-600">A professional smart contract audit.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mainnet</h3>
            <p className="text-slate-600">Covering the operational costs of our mainnet launch.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg border-t-4 border-t-emerald-500 relative">
            <div className="absolute top-4 right-4 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Adoption</h3>
            <p className="text-slate-600">Safely deploying Piper to onboard our first real-world DePIN customer immediately.</p>
          </div>
        </div>

        <div className="mt-16 text-xl font-bold text-slate-400 uppercase tracking-widest">
          Help us prove the power of Sui to everyday users.
        </div>
      </div>
    )
  }
];

export default function PitchPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  const paginate = (newDirection: number) => {
    if (currentIndex + newDirection >= 0 && currentIndex + newDirection < SLIDES.length) {
      setDirection(newDirection);
      setCurrentIndex(currentIndex + newDirection);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === 'ArrowLeft') {
        paginate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col font-sans selection:bg-emerald-200 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-6 md:px-12 w-full">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
          piper
        </Link>
        <div className="text-slate-400 font-medium">
          Slide {currentIndex + 1} of {SLIDES.length}
        </div>
      </header>

      {/* Slide Area */}
      <main className="flex-1 relative z-10 flex items-center justify-center w-full px-4 md:px-12 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className="w-full h-full flex items-center justify-center absolute"
          >
            {SLIDES[currentIndex].content()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="relative z-20 p-6 md:px-12 w-full flex items-center justify-between">
        <button
          onClick={() => paginate(-1)}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full flex items-center justify-center transition-all ${
            currentIndex === 0 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:scale-95 bg-slate-200/50'
          }`}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-emerald-500 shadow-md shadow-emerald-500/20' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={currentIndex === SLIDES.length - 1}
          className={`p-4 rounded-full flex items-center justify-center transition-all ${
            currentIndex === SLIDES.length - 1
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-white bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-lg'
          }`}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
