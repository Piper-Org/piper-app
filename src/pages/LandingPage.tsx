import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, animate, useMotionValue, AnimatePresence } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ArrowDown, ArrowUp, ShieldCheck, Coins, ChevronDown, Rocket, Droplets, ArrowRightLeft, MapPin, CheckCircle2, CircleDashed, Check, X } from 'lucide-react';
import { SuiLogo } from '@/components/common/SuiLogo';
import { UsdcLogo } from '@/components/common/UsdcLogo';
import { WhyPiperSection } from '@/components/common/WhyPiperSection';
import { HowItWorksSection } from '@/components/common/HowItWorksSection';
import { KineticTicker } from '@/components/common/KineticTicker';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const WORD_ANIMATIONS = [
  // 0: 3D Flip
  {
    initial: { opacity: 0, y: 30, rotateX: -90 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: -30, rotateX: 90 },
    transition: { duration: 0.5, type: 'spring', damping: 20, stiffness: 120 }
  },
  // 1: Typewriter / Reveal
  {
    initial: { opacity: 1, clipPath: "inset(0 100% 0 0)" },
    animate: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
    exit: { opacity: 1, clipPath: "inset(0 100% 0 0)" },
    transition: { duration: 0.6, ease: "linear" }
  },
  // 2: Soft Blur Scale
  {
    initial: { opacity: 0, scale: 0.8, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.2, filter: "blur(8px)" },
    transition: { duration: 0.5, ease: "easeInOut" }
  }
];

const COMPARISON_FEATURES = [
  {
    feature: "Immediate Finality",
    stream: { available: true, text: "Continuous finality per second" },
    escrow: { available: false, text: "Pending until condition met" },
    transfer: { available: true, text: "Instant finality upon receipt" }
  },
  {
    feature: "Conditional Logic",
    stream: { available: true, text: "Dynamic flow rates" },
    escrow: { available: true, text: "Custom milestone releases" },
    transfer: { available: false, text: "Rigid & unconditional" }
  },
  {
    feature: "Payday Bottleneck",
    stream: { available: true, text: "Usable immediately per second" },
    escrow: { available: false, text: "Delayed until milestone" },
    transfer: { available: false, text: "Delayed 2-4 weeks" }
  },
  {
    feature: "Counterparty Risk",
    stream: { available: true, text: "Math-enforced (stop = stop)" },
    escrow: { available: false, text: "Trusts arbiter" },
    transfer: { available: false, text: "Requires upfront trust" }
  },
  {
    feature: "Token Vesting",
    stream: { available: true, text: "Smooth, continuous release" },
    escrow: { available: false, text: "Sudden cliff unlocks" },
    transfer: { available: false, text: "Volatile manual batches" }
  },
  {
    feature: "Admin Overhead",
    stream: { available: true, text: "Fully automated" },
    escrow: { available: false, text: "Manual verification" },
    transfer: { available: false, text: "Heavy invoicing" }
  },
  {
    feature: "Capital Efficiency",
    stream: { available: true, text: "Instantly routable" },
    escrow: { available: false, text: "Capital sits idle" },
    transfer: { available: false, text: "Capital sits idle" }
  }
];

const AnimatedTableRow = ({ row, idx, arr, scrollProgress }: any) => {
  const xStart = idx % 2 === 0 ? -200 - (idx * 20) : 200 + (idx * 20);
  const yStart = 150 + (idx * 30);
  const rotateStart = idx % 2 === 0 ? -12 : 12;
  
  const x = useTransform(scrollProgress, [0, 1], [xStart, 0]);
  const y = useTransform(scrollProgress, [0, 1], [yStart, 0]);
  const rotate = useTransform(scrollProgress, [0, 1], [rotateStart, 0]);
  const opacity = useTransform(scrollProgress, [0, 0.7, 1], [0, 0.5, 1]);

  return (
    <motion.tr 
      style={{ x, y, rotate, opacity }}
      className="group hover:bg-slate-50/80 transition-colors"
    >
      <td className="p-5 border-b border-slate-100 font-semibold text-slate-800">{row.feature}</td>
      <td className="p-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          {row.transfer.available ? <Check className="w-6 h-6 text-slate-400 shrink-0" strokeWidth={3} /> : <X className="w-6 h-6 text-rose-400 shrink-0" strokeWidth={3} />}
          <span className={row.transfer.available ? "font-medium text-slate-700" : "text-slate-500"}>{row.transfer.text}</span>
        </div>
      </td>
      <td className="p-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          {row.escrow.available ? <Check className="w-6 h-6 text-slate-400 shrink-0" strokeWidth={3} /> : <X className="w-6 h-6 text-rose-400 shrink-0" strokeWidth={3} />}
          <span className={row.escrow.available ? "font-medium text-slate-700" : "text-slate-500"}>{row.escrow.text}</span>
        </div>
      </td>
      <td className={`p-5 border-b border-emerald-100 bg-emerald-50 ${idx === arr.length - 1 ? 'rounded-b-2xl shadow-[0_10px_40px_-15px_rgba(16,185,129,0.2)] border-b-0' : ''}`}>
        <div className="flex items-start gap-3">
          {row.stream.available ? <Check className="w-6 h-6 text-emerald-500 shrink-0" strokeWidth={3} /> : <X className="w-6 h-6 text-emerald-200 shrink-0" strokeWidth={3} />}
          <span className={row.stream.available ? "font-bold text-emerald-800" : "text-emerald-600/60"}>{row.stream.text}</span>
        </div>
      </td>
    </motion.tr>
  )
};

const AnimatedMobileCard = ({ row, idx }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  const xStart = idx % 2 === 0 ? -100 - (idx * 15) : 100 + (idx * 15);
  const yStart = 100 + (idx * 25);
  const rotateStart = idx % 2 === 0 ? -8 : 8;
  
  const x = useTransform(scrollYProgress, [0, 1], [xStart, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [yStart, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [rotateStart, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.3, 0.6, 1]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ x, y, rotate, scale, opacity }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="bg-slate-50 p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-lg">{row.feature}</h3>
      </div>
      <div className="p-5 space-y-5">
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Static Transfers
          </div>
          <div className="flex items-start gap-3 p-2">
            {row.transfer.available ? <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" strokeWidth={3} /> : <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" strokeWidth={3} />}
            <span className={row.transfer.available ? "font-medium text-slate-700 text-sm" : "text-slate-500 text-sm"}>{row.transfer.text}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Smart Contract Escrow
          </div>
          <div className="flex items-start gap-3 p-2">
            {row.escrow.available ? <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" strokeWidth={3} /> : <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" strokeWidth={3} />}
            <span className={row.escrow.available ? "font-medium text-slate-700 text-sm" : "text-slate-500 text-sm"}>{row.escrow.text}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-2">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-4 h-4" /> Payment Streams
          </div>
          <div className="flex items-start gap-3 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 shadow-inner">
            {row.stream.available ? <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} /> : <X className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" strokeWidth={3} />}
            <span className={row.stream.available ? "font-bold text-emerald-800 text-sm" : "text-emerald-700/60 text-sm font-medium"}>{row.stream.text}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const matrixRef = useRef<HTMLElement>(null);
  const { scrollYProgress: matrixProgress } = useScroll({
    target: matrixRef,
    offset: ["start end", "center center"]
  });


  // Enoki often forces or defaults the OAuth callback to the root origin.
  // We must catch the token here and forward it to the dashboard where WalletGate can process it.
  useEffect(() => {
    if (window.location.hash.includes('id_token=')) {
      window.location.href = '/dashboard' + window.location.hash;
    }
  }, []);

  const count = useMotionValue(100);
  const senderDisplay = useTransform(count, (latest) => `${latest.toFixed(2)} USDC`);
  const receiverDisplay = useTransform(count, (latest) => `${(100 - latest).toFixed(2)} USDC`);

  useEffect(() => {
    count.set(100); // Explicitly reset to 100 so the loop always starts from exactly 100
    const controls = animate(count, 0, {
      duration: 100,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop"
    });
    return controls.stop;
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-clip font-sans selection:bg-emerald-200">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-slate-100">
        <div 
          className="absolute bottom-0 inset-x-0 w-full h-[60vh] bg-cover bg-bottom bg-no-repeat opacity-[0.25] mix-blend-luminosity [mask-image:linear-gradient(to_bottom,transparent,black_40%)]"
          style={{ backgroundImage: "url('/suiF1.jpg')" }}
        />

      </div>

      <div className="relative z-10">
        
        {/* Sticky Hero Wrapper for Desktop */}
        <div className="md:sticky md:top-0 md:h-screen w-full flex flex-col z-0 overflow-hidden">
          {/* Navigation */}
          <nav className="shrink-0 flex items-center justify-between p-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="text-2xl font-bold tracking-tight text-black select-none flex items-center gap-2">
            piper <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://www.npmjs.com/package/@usepiper/sdk?activeTab=readme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-slate-500 hover:text-slate-900 font-semibold transition-colors"
            >
              Docs
            </a>
            <Link 
              to="/dashboard"
              className="hidden sm:flex group items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-sm"
            >
              Login
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 pt-12 md:pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center text-center w-full">
          <motion.div variants={STAGGER} initial="hidden" animate="show" className="max-w-4xl space-y-6">
            <motion.h1 variants={FADE_UP} className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Money Moving<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">per second</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">
              Experience the future of real-time payment
            </motion.p>
            
            <motion.div variants={FADE_UP} className="pt-8 flex flex-col items-center justify-center gap-6 relative">
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-slate-400"
              >
                <ArrowDown className="w-6 h-6" />
              </motion.div>
              
              <Link 
                to="/dashboard"
                className="w-auto group bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 px-8 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
              >
                Start Streaming
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Animation Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-32 md:mt-28 w-full max-w-4xl bg-white/20 backdrop-blur-[40px] backdrop-saturate-150 border border-white/40 rounded-[2.5rem] py-8 px-4 md:px-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden ring-1 ring-white/50"
          >
            {/* Liquid Reflection Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/5 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/40 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-300/20 blur-3xl rounded-full pointer-events-none" />
            
            <h3 className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-12 relative z-10 drop-shadow-sm">The Paradigm Shift</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="font-semibold text-slate-600">Sender</div>
                <div className="w-28 h-28 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner p-2">
                  <div className="text-center">
                    <motion.div className="font-bold text-slate-900 tabular-nums text-sm">{senderDisplay}</motion.div>
                    <div className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">Instantly<br/>Available</div>
                  </div>
                </div>
              </div>

              {/* Streaming Animation */}
              <div className="flex-1 flex items-center justify-center h-32 md:h-20 w-full md:w-auto relative">
                {/* Desktop Horizontal Line */}
                <div className="hidden md:block absolute w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 100, ease: "linear", repeat: Infinity, repeatType: "loop" }}
                  />
                </div>
                
                {/* Mobile Vertical Line */}
                <div className="block md:hidden absolute h-28 w-1.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className="w-full bg-emerald-500"
                    animate={{ height: ["0%", "100%"] }}
                    transition={{ duration: 100, ease: "linear", repeat: Infinity, repeatType: "loop" }}
                  />
                  {/* Shooting Light Pulse */}
                  <motion.div 
                    className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-white to-transparent blur-[1px] mix-blend-overlay"
                    animate={{ top: ["-50%", "150%"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                {/* Desktop Horizontal Particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`h-${i}`}
                    className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] hidden md:block"
                    style={{ left: "-10px", top: "50%", y: "-50%" }}
                    animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.3,
                      ease: "linear" 
                    }}
                  />
                ))}


              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="font-semibold text-slate-600 order-last md:order-first">Receiver</div>
                <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-elevated relative overflow-hidden p-2">
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-slate-100/80 -z-10"
                    animate={{ height: ["0%", "100%"] }}
                    transition={{ duration: 100, ease: "linear", repeat: Infinity, repeatType: "loop" }}
                  />
                  <div className="text-center">
                    <motion.div 
                      className="font-bold text-slate-900 text-sm tabular-nums"
                    >
                      {receiverDisplay}
                    </motion.div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-1 leading-tight">Instantly<br/>Withdrawable</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        </div>

        {/* Content that scrolls over the static hero */}
        <div className="relative z-10 bg-white">
          {/* Comparison Matrix */}
          <section ref={matrixRef} className="py-24 bg-white border-t border-slate-100 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Why Stream Payments?</h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-5 border-b border-slate-200 w-1/4"></th>
                    <th className="p-5 border-b border-slate-200 font-bold text-slate-600 text-lg w-1/4">Static Transfers</th>
                    <th className="p-5 border-b border-slate-200 font-bold text-slate-600 text-lg w-1/4">Smart Contract Escrow</th>
                    <th className="p-5 border-b border-emerald-200 font-bold text-emerald-700 bg-emerald-50 rounded-t-2xl shadow-[0_-10px_40px_-15px_rgba(16,185,129,0.2)] w-1/4">
                      <div className="flex items-center gap-2 text-lg"><Droplets className="w-6 h-6"/> Payment Streams</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  {COMPARISON_FEATURES.map((row, idx, arr) => (
                    <AnimatedTableRow key={idx} row={row} idx={idx} arr={arr} scrollProgress={matrixProgress} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-6">
              {COMPARISON_FEATURES.map((row, idx) => (
                <AnimatedMobileCard key={idx} row={row} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Kinetic Ticker */}
        <KineticTicker />

        {/* Why Piper Section */}
        <WhyPiperSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Roadmap */}
        <section className="py-32 bg-white relative overflow-hidden border-t border-slate-100">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-6"
               >
                 <MapPin className="w-4 h-4" /> The Journey Ahead
               </motion.div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Roadmap</h2>
              <p className="text-slate-500 font-medium text-lg">Where we are and where Piper is going next.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  quarter: "Q2 2026",
                  title: "Protocol Beta",
                  description: "Testnet deployment of core contracts, SDK creation, and Enoki zkLogin integration.",
                  status: "completed"
                },
                {
                  quarter: "Q3 2026",
                  title: "Mainnet V1",
                  description: "Official launch on Sui Mainnet with stablecoin streams and public API.",
                  status: "in-progress"
                },
                {
                  quarter: "Q4 2026",
                  title: "Ecosystem Growth",
                  description: "Deep integrations with partner dApps, wallets, and payroll providers.",
                  status: "upcoming"
                },
                {
                  quarter: "Q1 2027",
                  title: "Multi-Token Streams",
                  description: "Support for streaming multiple assets in one PTB and decentralized governance.",
                  status: "upcoming"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="bg-white rounded-3xl p-6 shadow-subtle border border-slate-100 hover:shadow-md transition-shadow relative flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.quarter}</span>
                    {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {item.status === 'in-progress' && <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />}
                    {item.status === 'upcoming' && <CircleDashed className="w-5 h-5 text-slate-300" />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 font-medium flex-1">{item.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block
                      ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-100 text-slate-500'}`}
                    >
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-24 bg-slate-900 text-white border-t border-slate-800 rounded-t-[3rem]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-400 font-medium">Everything you need to know about payment streams.</p>
            </div>

            <div className="space-y-4">
              <FAQItem 
                question="What is a payment stream?" 
                answer="A payment stream is a continuous flow of money from a sender to a receiver over time. Instead of sending a lump sum, the smart contract unlocks a micro-fraction of the total amount every second."
              />
              <FAQItem 
                question="Can I cancel a stream midway?" 
                answer="Yes. As a sender, you can revoke a stream at any time. The smart contract calculates the exact amount unlocked up to that second—giving it to the receiver—and refunds the remaining locked balance to you."
              />
              <FAQItem 
                question="Do I need a Web3 wallet?" 
                answer="No! Thanks to our Enoki integration, you can simply sign in with your Google or Twitch account and start streaming immediately. We manage the wallet behind the scenes."
              />
              <FAQItem 
                question="How are gas fees handled?" 
                answer="You only pay a standard, tiny network gas fee once when creating the stream, and the receiver pays a small fee when withdrawing. There are no ongoing fees for the streaming process itself."
              />
            </div>
            
            <div className="mt-16 text-center">
               <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex bg-slate-900 hover:bg-black text-white text-lg font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all hover:scale-105 active:scale-95 items-center justify-center gap-2"
                >
                  Back to Top <ArrowUp className="w-5 h-5" />
                </button>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-700/50 bg-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-colors hover:bg-slate-800">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-semibold text-lg">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-slate-400 leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
