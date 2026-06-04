import { AnimatePresence } from 'framer-motion';
import { useWizardStore } from '@/store/useWizardStore';
import { ModeSelector } from './ModeSelector';
import { FlowRateInput } from './FlowRateInput';
import { RecipientInput } from './RecipientInput';
import { ReviewSummary } from './ReviewSummary';
import { ArrowLeft } from 'lucide-react';

export function StreamWizard() {
  const { step, nextStep, prevStep } = useWizardStore();

  return (
    <div className="max-w-md mx-auto relative min-h-[500px]">
      
      {/* Header / Nav */}
      <div className="flex items-center justify-between mb-8 h-10">
        {step > 0 ? (
          <button 
            onClick={prevStep}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-10" />}
        
        {/* Step Indicator */}
        <div className="flex gap-2">
          {[0,1,2,3].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'}`} 
            />
          ))}
        </div>
        
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && <ModeSelector key="step-0" />}
        {step === 1 && <FlowRateInput key="step-1" />}
        {step === 2 && <RecipientInput key="step-2" />}
        {step === 3 && <ReviewSummary key="step-3" />}
      </AnimatePresence>

      {/* Next Button Footer */}
      {step < 3 && (
        <div className="absolute bottom-[-80px] left-0 right-0">
          <button
            onClick={nextStep}
            className="w-full bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-elevated transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
