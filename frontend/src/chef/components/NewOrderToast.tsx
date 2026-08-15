import React from 'react';
import { BellRing, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewOrderToastProps {
  isVisible: boolean;
  onClose: () => void;
  orderId: string;
}

export const NewOrderToast = ({ isVisible, onClose, orderId }: NewOrderToastProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -80, x: '-50%', scale: 0.9 }}
          animate={{ opacity: 1, y: 24, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: -80, x: '-50%', scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed top-0 left-1/2 z-[100] w-full max-w-md px-4"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-brand-primary/40 rounded-2xl p-4 shadow-[0_20px_50px_rgba(242,125,38,0.18)] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="bg-gradient-to-tr from-brand-primary to-amber-500 text-white p-2.5 rounded-xl shadow-lg shadow-brand-primary/30">
                  <BellRing size={20} />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">New Order Placed!</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Order <span className="font-mono text-brand-primary font-bold">{orderId}</span> needs your confirmation.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-stone-900 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
