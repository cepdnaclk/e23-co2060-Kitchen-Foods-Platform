import React from 'react';
import { Bell, X } from 'lucide-react';
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
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-0 left-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="bg-orange-500 text-white p-4 rounded-2xl shadow-2xl shadow-orange-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bell className="animate-bounce" size={20} />
              </div>
              <div>
                <p className="font-bold">New Order Received!</p>
                <p className="text-xs text-orange-100">Order {orderId} is waiting for your approval.</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
