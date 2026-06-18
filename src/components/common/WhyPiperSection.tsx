import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CONTENT = [
  "Piper transforms static payments into fluid, continuous streams.",
  "Money moves like water—per second, completely on-chain, and mathematically enforced.",
  "Use Continuous Streams for salaries, subscriptions, and Vesting.",
  "Or use Pay-Per-Use Streams for AI agents—pre-authorizing a budget that streams payment per-token generated.",
  "Built for the Web2 mind, native to Web3. The @usepiper/sdk lets you integrate complex streaming logic in minutes.",
  "Because piper streams are native Sui objects, you can compose them directly into Programmable Transaction Blocks."
];
function AnimatedSentence({ text, progress, start, end }: { text: string, progress: any, start: number, end: number }) {
  const words = text.split(" ");
  return (
    <span className="inline">
      {words.map((word: string, i: number) => {
        const wordStart = start + (i / words.length) * ((end - start) * 0.6);
        const wordEnd = wordStart + ((end - start) * 0.4);
        
        return (
          <span key={i}>
            <AnimatedWord word={word} progress={progress} start={wordStart} end={wordEnd} />
            {i !== words.length - 1 && " "}
          </span>
        );
      })}
    </span>
  );
}

function AnimatedWord({ word, progress, start, end }: { word: string, progress: any, start: number, end: number }) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const blur = useTransform(progress, [start, end], ["blur(12px)", "blur(0px)"]);
  const scale = useTransform(progress, [start, end], [1.4, 1]);
  const brightness = useTransform(progress, [start, end], ["brightness(50%)", "brightness(100%)"]);

  return (
    <motion.span 
      style={{ opacity, filter: blur, scale, WebkitFilter: brightness }} 
      className="inline-block origin-bottom"
    >
      {word}
    </motion.span>
  );
}

export function WhyPiperSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const titleY = useTransform(scrollYProgress, [0, 0.1], ["40vh", "0vh"]);
  const titleScale = useTransform(scrollYProgress, [0, 0.1], [3.5, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.7]);

  return (
    <section ref={targetRef} className="relative bg-slate-950 text-white" style={{ height: '600vh' }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

        <motion.div 
          style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
          className="absolute top-16 md:top-24 left-0 right-0 flex justify-center z-20"
        >
           <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-sm md:text-base drop-shadow-lg">
            Why Piper?
          </span>
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto w-full h-[300px] md:h-[400px] flex items-center justify-center mt-20 md:mt-10">
          {CONTENT.map((text, idx) => {
            const step = 0.9 / CONTENT.length;
            const start = 0.1 + (idx * step);
            const center = start + step / 2;
            const end = start + step;
            
            const yOffset = useTransform(scrollYProgress, [start, center, end], [40, 0, -40]);
            const opacity = useTransform(scrollYProgress, [start, start + step/4, end - step/4, end], [0, 1, 1, 0]);
            const scale = useTransform(scrollYProgress, [start, center, end], [0.95, 1, 0.95]);

            return (
              <motion.div
                key={idx}
                style={{ y: yOffset, opacity, scale }}
                className="absolute inset-0 flex items-center justify-center text-center pointer-events-none"
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight md:leading-snug text-white px-4 tracking-tight drop-shadow-2xl">
                  <AnimatedSentence text={text} progress={scrollYProgress} start={start} end={center} />
                </h2>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
