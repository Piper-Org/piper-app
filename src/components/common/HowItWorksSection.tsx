import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const STEPS = [
  {
    id: "01",
    title: "Connect",
    description: "Sign up instantly with Google (zkLogin) or connect your preferred Web3 wallet.",
  },
  {
    id: "02",
    title: "Select Stream Type",
    description: "Choose your stream type based on your use case—Continuous or Pay-Per-Use.",
  },
  {
    id: "03",
    title: "Target",
    description: "Input a Sui address, a SuiNS name, or simply scan a QR code to set the recipient.",
  },
  {
    id: "04",
    title: "Monitor",
    description: "View your live stream ticking second-by-second right on your dashboard.",
  },
  {
    id: "05",
    title: "Settle",
    description: "Streamed value is instantly liquid and available to the receiver without delay.",
  },
  {
    id: "06",
    title: "Control",
    description: "You have full sovereign control. Stop the stream completely at any time.",
  }
];

function PipelineNode({ step, index, progress, totalSteps, isMobile }: any) {
  const center = index / (totalSteps - 1);
  const range = 1 / (totalSteps - 1);
  
  // High contrast scaling and fading. Fades to very subtle, activates to pure black
  const scale = useTransform(progress, [center - range, center, center + range], [0.85, 1.1, 0.85]);
  const opacity = useTransform(progress, [center - range, center, center + range], [0.15, 1, 0.15]);
  const yOffset = useTransform(progress, [center - range, center, center + range], [40, 0, 40]);
  
  const isTop = index % 2 === 0;

  const invertedYOffset = useTransform(yOffset, y => -y);

  return (
    <div 
      className="relative flex flex-col items-center justify-center shrink-0 h-full"
      style={{ width: `${isMobile ? 85 : 45}vw` }}
    >
      {/* Precision Central Node on the Pipeline */}
      <motion.div 
        style={{ scale }} 
        className="w-4 h-4 rotate-45 bg-slate-900 border-2 border-white z-20" 
      />

      {/* Content Branch */}
      <motion.div 
        style={{ scale, opacity, y: isTop ? yOffset : invertedYOffset }} 
        className={`absolute ${isTop ? 'bottom-[calc(50%+2rem)] md:bottom-[calc(50%+3rem)]' : 'top-[calc(50%+2rem)] md:top-[calc(50%+3rem)]'} w-full flex flex-col items-center text-center px-4`}
      >
        <div className="relative flex flex-col items-center">
          {/* Subtle connecting architectural line */}
          <div className={`absolute left-1/2 -translate-x-1/2 w-[1px] h-16 bg-slate-200 pointer-events-none -z-10 ${isTop ? '-bottom-16' : '-top-16'}`} />
          
          <span className="text-[6rem] md:text-[8rem] leading-none font-black text-slate-100 tracking-tighter mb-2 font-mono">
            {step.id}
          </span>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter mb-4">{step.title}</h3>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-sm leading-relaxed">{step.description}</p>
        </div>
      </motion.div>
    </div>
  )
}

export function HowItWorksSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const nodeWidthVW = isMobile ? 85 : 45;
  const paddingLeftVW = 50 - (nodeWidthVW / 2);
  const totalTranslateVW = -(STEPS.length - 1) * nodeWidthVW;

  const x = useTransform(scrollYProgress, [0.17, 0.6], ["0vw", `${totalTranslateVW}vw`]);
  const normalizedProgress = useTransform(scrollYProgress, [0.17, 0.6], [0, 1]);

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-white border-t border-b border-slate-100">
      <div className="sticky top-0 h-screen flex flex-col items-start justify-center overflow-hidden">
        
        <div className="absolute top-12 md:top-24 left-6 md:left-24 z-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-2">How it works</h2>
        </div>

        {/* Technical Grid Background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-40" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />

        {/* Fintech Flowing Water (Parallax SVG Waves) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          <motion.div 
            style={{ x: useTransform(scrollYProgress, [0, 1], ["0vw", "-150vw"]) }} 
            className="absolute top-1/2 left-0 w-[400vw] h-[60vh] -translate-y-1/2"
          >
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-transparent">
              <path d="M0,50 Q125,100 250,50 T500,50 T750,50 T1000,50" className="stroke-emerald-300 stroke-[1px]" />
              <path d="M0,60 Q125,10 250,60 T500,60 T750,60 T1000,60" className="opacity-60 stroke-blue-300 stroke-[1px]" />
              <path d="M0,40 Q125,90 250,40 T500,40 T750,40 T1000,40" className="opacity-70 stroke-teal-300 stroke-[1px]" />
            </svg>
          </motion.div>

          <motion.div 
            style={{ x: useTransform(scrollYProgress, [0, 1], ["-50vw", "-100vw"]) }} 
            className="absolute top-1/2 left-0 w-[400vw] h-[60vh] -translate-y-1/2"
          >
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-transparent">
              <path d="M0,50 Q125,0 250,50 T500,50 T750,50 T1000,50" className="stroke-emerald-200 stroke-[2px]" />
              <path d="M0,70 Q125,20 250,70 T500,70 T750,70 T1000,70" className="opacity-50 stroke-blue-200 stroke-[2px]" />
            </svg>
          </motion.div>
        </div>

        {/* The Pipeline Track */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200 -translate-y-1/2 z-10 overflow-hidden">
          {/* Precision stream filling the pipe */}
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-slate-900"
            style={{ width: useTransform(normalizedProgress, [0, 1], ["0%", "100%"]) }}
          />
        </div>

        {/* The Nodes */}
        <motion.div 
          style={{ x, paddingLeft: `${paddingLeftVW}vw`, paddingRight: `${paddingLeftVW}vw` }} 
          className="flex items-center h-full z-20"
        >
          {STEPS.map((step, idx) => (
            <PipelineNode 
              key={idx} 
              step={step} 
              index={idx} 
              progress={normalizedProgress} 
              totalSteps={STEPS.length} 
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
