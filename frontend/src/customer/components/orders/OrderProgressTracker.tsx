// ---------------------------------------------------------------------------
// OrderProgressTracker
// ---------------------------------------------------------------------------
// Visual "Pending → Preparing → Ready → Delivered" progress bar with nodes
// connected by an animated line. The current step is derived from the
// order's raw status string (see constants/orderStatus.ts).
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { ORDER_STATUS_STEPS } from '../../constants/orderStatus';

interface OrderProgressTrackerProps {
  /** Raw status string from the order, used to compute the current step. */
  status: string;
}

export const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({ status }) => {
  const currentStep = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <div className="relative pt-6 mt-6 border-t border-stone-100">
      {/* Connecting line background */}
      <div className="absolute top-10 left-6 right-6 h-1.5 bg-stone-100 rounded-full" />

      {/* Active connecting line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(Math.max(0, currentStep) / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="absolute top-10 left-6 h-1.5 bg-brand-primary rounded-full origin-left shadow-[0_0_10px_rgba(234,88,12,0.5)]"
      />

      <div className="relative flex justify-between">
        {ORDER_STATUS_STEPS.map((step, i) => {
          const isStepCompleted = i < currentStep;
          const isStepCurrent = i === currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-4 relative z-10 w-24">
              {/* Node point */}
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isStepCurrent ? 1.2 : 1,
                    backgroundColor: isStepCompleted || isStepCurrent ? '#ea580c' : '#f5f5f4',
                    borderColor: isStepCurrent ? '#ffffff' : 'transparent',
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-4 transition-colors duration-500 z-10 relative ${
                    isStepCurrent ? 'shadow-lg shadow-brand-primary/40' : ''
                  }`}
                />
                {/* Pulsing ring for the current step */}
                {isStepCurrent && (
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                    className="absolute inset-0 bg-brand-primary rounded-full -z-10"
                  />
                )}
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors duration-500 ${
                  isStepCompleted || isStepCurrent ? 'text-brand-primary' : 'text-stone-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
