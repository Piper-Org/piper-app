import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, animate, useMotionValue } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowUp, ChevronDown, Droplets, MapPin, Check, X } from 'lucide-react';
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

function RoadmapStep({ item, index }: { item: any, index: number }) {
  const stepRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start 90%", "center center"]
  });

  const isEven = index % 2 === 0;
  
  // Scrubs from 50% away to 0 over the designated scroll window
  const x = useTransform(scrollYProgress, [0, 1], [isEven ? '-50%' : '50%', '0%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div 
      ref={stepRef}
      style={{ x, opacity }}
      className="relative w-full max-w-2xl mx-auto py-12 flex items-center z-10"
    >
      {/* The Node (Map Pin) */}
      <div
        className="absolute z-20 flex items-center justify-center"
        style={{ left: isEven ? '40%' : '60%', top: '50%', transform: 'translate(-50%, -100%)' }}
      >
        <MapPin 
          className={`w-10 h-10 md:w-12 md:h-12 fill-[#020817] ${item.status === 'done' ? 'text-emerald-500 drop-shadow-[0_4px_12px_rgba(16,185,129,0.5)]' : (item.status === 'in progress' || item.status === 'ongoing') ? 'text-blue-500 drop-shadow-[0_4px_12px_rgba(59,130,246,0.5)] animate-pulse' : 'text-slate-600 drop-shadow-sm'}`} 
          strokeWidth={2.5} 
        />
        <div className={`absolute top-[32%] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${item.status === 'done' ? 'bg-emerald-500' : (item.status === 'in progress' || item.status === 'ongoing') ? 'bg-blue-500' : 'bg-slate-600'}`} />
      </div>

      {/* The Modern Floating Text */}
      <div className={`w-[85%] mx-auto md:mx-0 md:w-[36%] ${isEven ? 'md:mr-auto text-center md:text-right md:pr-1' : 'md:ml-auto text-center md:text-left md:pl-1'}`}>
        <div className={`relative z-30 flex flex-col items-center ${isEven ? 'md:items-end' : 'md:items-start'}`}>
          {/* Modern floating glow to ensure readability over the line */}
          <div className="absolute inset-0 bg-[#020817]/70 md:bg-transparent blur-3xl -z-10 scale-150 rounded-full pointer-events-none" />
          
          <div className={`flex items-center gap-3 mb-2 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.quarter}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border
              ${item.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                (item.status === 'in progress' || item.status === 'ongoing') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              {item.status}
            </span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-sm">{item.title}</h3>
          <p className="text-slate-400 font-medium leading-relaxed drop-shadow-sm">{item.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DestinationCounter() {
  const [count, setCount] = useState(1635586943);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start 50%"]
  });

  const letterSpacing = useTransform(scrollYProgress, [0, 1], ["0.15em", "-0.05em"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity }}
      className="relative mt-20 text-center z-10"
    >
      <div className="inline-block relative">
        <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-150 -z-10" />
        <div className="text-lg md:text-xl font-bold text-slate-400 uppercase tracking-widest mb-2 drop-shadow-sm">
          Facilitate
        </div>
        <motion.h3 
          style={{ letterSpacing, scale }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-black font-mono text-emerald-500 tracking-tighter mb-4 drop-shadow-sm leading-none"
        >
          ${count.toLocaleString()}+
        </motion.h3>
        <p className="text-xl md:text-2xl text-slate-500 font-medium drop-shadow-sm">in money streamed</p>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {

  const matrixRef = useRef<HTMLElement>(null);
  const { scrollYProgress: matrixProgress } = useScroll({
    target: matrixRef,
    offset: ["start end", "center center"]
  });

  const roadmapRef = useRef<HTMLElement>(null);
  const { scrollYProgress: roadmapProgress } = useScroll({
    target: roadmapRef,
    offset: ["start center", "end center"]
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
              Experience the future of real-time payments
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
        <section 
          ref={roadmapRef} 
          className="py-32 relative overflow-hidden border-t border-slate-800 z-20 shadow-[0_-30px_50px_-15px_rgba(0,0,0,0.5)] -mt-[100vh]"
          style={{ 
            backgroundImage: "url('/stream-road.jpg')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Image Overlay to soften the background */}
          <div className="absolute inset-0 bg-[#020817]/90 backdrop-blur-[3px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">Roadmap</h2>
            </div>

            <div className="relative w-full max-w-5xl mx-auto h-[1250px] flex flex-col justify-around">
              {/* Winding SVG Road Background */}
              <div className="absolute inset-0 pointer-events-none flex justify-center">
                <svg className="w-full max-w-2xl h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Base Track */}
                  <path d="M 50,0 Q 40,10 50,20 T 50,40 T 50,60 T 50,80 T 50,100" fill="none" className="stroke-slate-800 stroke-[4px] md:stroke-[2px]" />
                  {/* Animated Progress Track */}
                  <motion.path 
                    d="M 50,0 Q 40,10 50,20 T 50,40 T 50,60 T 50,80 T 50,100" 
                    fill="none" className="stroke-emerald-500 stroke-[6px] md:stroke-[4px]" 
                    style={{ pathLength: roadmapProgress }}
                  />
                </svg>
              </div>

              {[
                {
                  quarter: "Q2 2026",
                  title: "Beta",
                  description: "Testnet deployment and v0.1.0 sdk release",
                  status: "done"
                },
                {
                  quarter: "Q2 2026",
                  title: "Onboarding",
                  description: "Get users and dev to test app and build with sdk",
                  status: "ongoing"
                },
                {
                  quarter: "Q2 - Q3 2026",
                  title: "Traction",
                  description: "Win Sui overflow 2026 and gain ecosystem traction",
                  status: "ongoing"
                },
                {
                  quarter: "Q3 2026",
                  title: "Audit",
                  description: "Get piper packages audited by experts",
                  status: "upcoming"
                },
                {
                  quarter: "Q4 2026",
                  title: "Mainnet",
                  description: "Public launch of piper on sui mainnet",
                  status: "upcoming"
                }
              ].map((item, index) => (
                <RoadmapStep key={index} item={item} index={index} />
              ))}
            </div>
            
            {/* The Destination */}
            <DestinationCounter />
          </div>
        </section>

        {/* Iconic Footer */}
        <footer className="pt-32 pb-8 bg-slate-100 text-slate-900 border-t border-slate-200 rounded-t-[3rem] relative overflow-hidden">
          
          {/* Background Image Layer - Grayscale and blended just like hero */}
          <div 
            className="absolute bottom-0 inset-x-0 w-full h-[80vh] md:h-[60vh] opacity-[0.25] mix-blend-luminosity pointer-events-none translate-y-[5vh] md:translate-y-[8vh] [mask-image:linear-gradient(to_bottom,transparent,black_40%)]"
            style={{ 
              backgroundImage: "url('/suiF1.jpg')", 
              backgroundSize: '100% auto', 
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat'
            }}
          />

          <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left Column: FAQ */}
              <div>
                <div className="mb-12">
                  <h2 className="text-4xl font-bold mb-4 tracking-tight">FAQ</h2>
                  <p className="text-slate-500 font-medium">Everything you need to know about payment streams.</p>
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
              </div>

              {/* Right Column: Connect & Socials */}
              <div className="flex flex-col justify-between pt-2">
                <div className="grid grid-cols-2 gap-12">
                  {/* Developers */}
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg text-slate-900 font-bold tracking-tight mb-2">Developers</h3>
                    <a href="#" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">Documentation</a>
                    <a href="#" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">TypeScript SDK</a>
                    <a href="#" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">GitHub</a>
                  </div>
                  {/* Connect */}
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg text-slate-900 font-bold tracking-tight mb-2">Connect</h3>
                    <a href="#" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">Twitter (X)</a>
                    <a href="#" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">Discord</a>
                    <a href="#" className="text-slate-500 hover:text-emerald-600 font-medium transition-colors">Blog</a>
                  </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-end">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold py-3 px-6 rounded-full transition-all hover:scale-105 active:scale-95 items-center justify-center gap-2"
                  >
                    Back to Top <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Iconic Bottom Text */}
          <div className="w-full relative z-10 pt-8 pb-4 overflow-hidden border-t border-slate-200">
            <div className="w-full flex flex-col items-center text-center">
              <h1 className="text-[8vw] leading-[0.8] font-black tracking-tighter select-none flex flex-col md:flex-row justify-center items-center md:items-end gap-8 md:gap-20 w-full px-4 drop-shadow-sm">
                <div className="flex items-start pb-0 md:pb-[2vw] pt-[2vw]">
                  <span className="text-[3.5vw] tracking-widest text-slate-900/40">
                    money/seconds
                  </span>
                  <span className="text-[2vw] font-black text-slate-900/40 -mt-[0.2vw]">
                    2
                  </span>
                </div>
              </h1>
              <p className="mt-12 text-xs md:text-sm text-slate-400 font-bold tracking-widest uppercase">
                © 2026 Piper. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 bg-white/60 rounded-2xl overflow-hidden backdrop-blur-sm transition-colors hover:bg-white/90 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-semibold text-lg text-slate-900">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </motion.div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-slate-600 leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
