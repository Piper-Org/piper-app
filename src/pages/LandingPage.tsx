import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Zap, ShieldCheck, Coins, ChevronDown, Rocket, Droplets, ArrowRightLeft } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-emerald-200">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y }} className="absolute inset-0 opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400 blur-[120px] mix-blend-multiply opacity-50 animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300 blur-[120px] mix-blend-multiply opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </motion.div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tight text-black select-none flex items-center gap-2">
            piper <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <Link 
            to="/dashboard"
            className="group flex items-center gap-2 bg-black hover:bg-slate-800 text-white font-semibold py-2.5 px-5 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Launch DApp
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>

        {/* Hero Section */}
        <main className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div variants={STAGGER} initial="hidden" animate="show" className="max-w-4xl space-y-6">
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" /> The Future of Programmable Money
            </motion.div>
            
            <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Make payments <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">alive.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Why transfer when you can stream it? Payments don't have to be static. Stream value second by second, completely on-chain.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-elevated transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Start Streaming <Rocket className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Animation Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 w-full max-w-4xl bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">The Paradigm Shift</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="font-bold text-slate-900">100 SUI</div>
                    <div className="text-xs text-slate-500 font-medium">Locked</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-600">Sender</div>
              </div>

              {/* Streaming Animation */}
              <div className="flex-1 flex items-center justify-center h-20 w-full md:w-auto relative">
                <div className="absolute w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-500"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                  />
                </div>
                
                {/* Particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    style={{ left: "-10px" }}
                    animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.4,
                      ease: "linear" 
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-2xl bg-white border-2 border-emerald-400 flex items-center justify-center shadow-elevated relative overflow-hidden">
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-emerald-100/50 -z-10"
                    animate={{ height: ["0%", "100%"] }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                  />
                  <div className="text-center">
                    <motion.div 
                      className="font-bold text-emerald-600 text-xl"
                    >
                      Real-time
                    </motion.div>
                    <div className="text-xs text-emerald-500/70 font-semibold uppercase tracking-wider mt-1">Available</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-600">Receiver</div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Comparison Matrix */}
        <section className="py-24 bg-white/60 backdrop-blur-md border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why stream instead of transfer?</h2>
              <p className="text-slate-500 font-medium">Compare Piper streams with traditional payment structures.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-slate-200"></th>
                    <th className="p-4 border-b border-slate-200 font-bold text-emerald-600 bg-emerald-50/50 rounded-t-xl">
                      <div className="flex items-center gap-2"><Droplets className="w-5 h-5"/> Piper Streams</div>
                    </th>
                    <th className="p-4 border-b border-slate-200 font-bold text-slate-600">Smart Contract Escrow</th>
                    <th className="p-4 border-b border-slate-200 font-bold text-slate-600">Micro-transactions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="p-4 border-b border-slate-100 font-semibold text-slate-700">Capital Efficiency</td>
                    <td className="p-4 border-b border-emerald-100 bg-emerald-50/50 font-medium text-emerald-700">Liquid instantly</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Locked until conditions met</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Liquid per chunk</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-slate-100 font-semibold text-slate-700">Gas Costs</td>
                    <td className="p-4 border-b border-emerald-100 bg-emerald-50/50 font-medium text-emerald-700">Extremely Low (1 TX to start)</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Medium (Multiple contract calls)</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Very High (Per transaction)</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-slate-100 font-semibold text-slate-700">Trust Required</td>
                    <td className="p-4 border-b border-emerald-100 bg-emerald-50/50 font-medium text-emerald-700">Zero (Fully on-chain & math-based)</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Trust the contract logic</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Trust the sender to keep sending</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-slate-100 font-semibold text-slate-700">Cancellation</td>
                    <td className="p-4 border-b border-emerald-100 bg-emerald-50/50 font-medium text-emerald-700 rounded-b-xl">Pro-rated to the exact second</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Often messy or binary (all/nothing)</td>
                    <td className="p-4 border-b border-slate-100 text-slate-500">Stop sending anytime</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-500 font-medium">Get started in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-subtle border border-slate-100"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Coins className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Define the Flow</h3>
              <p className="text-slate-500">Select the asset (SUI or USDC), set the total amount, and choose your flow rate per second, minute, or month.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-subtle border border-slate-100"
            >
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Authorize PTB</h3>
              <p className="text-slate-500">Sign a single Programmable Transaction Block using your Web3 wallet or Enoki Google Auth. It's safe and instant.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-subtle border border-slate-100"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <ArrowRightLeft className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Stream Live</h3>
              <p className="text-slate-500">The recipient instantly starts receiving the funds. They can withdraw their unlocked balance at any time.</p>
            </motion.div>
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
               <Link 
                  to="/dashboard"
                  className="inline-flex bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 items-center justify-center gap-2"
                >
                  Launch DApp <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
          </div>
        </section>
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
