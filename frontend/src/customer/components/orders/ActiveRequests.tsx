// ---------------------------------------------------------------------------
// ActiveRequests
// ---------------------------------------------------------------------------
// The "Your Active Requests" section: a friendly empty state when there are
// no orders, otherwise a stacked list of OrderRequestCard components.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import type { Request } from '../../types';
import { OrderRequestCard } from './OrderRequestCard';

interface ActiveRequestsProps {
  requests: Request[];
}

export const ActiveRequests: React.FC<ActiveRequestsProps> = ({ requests }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.45 }}
    className="mt-20"
  >
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-3xl font-serif font-bold text-stone-900">Your Active Requests</h3>
        <p className="text-sm text-stone-500 mt-1">Orders you've placed — track them here.</p>
      </div>
    </div>

    {requests.length === 0 ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white rounded-[40px] border border-dashed border-stone-200 shadow-sm"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary/40 shadow-inner"
        >
          <Calendar size={32} />
        </motion.div>
        <h4 className="text-2xl font-bold text-stone-900 font-serif mb-2">No active requests</h4>
        <p className="text-stone-500">Select a category above to place an order!</p>
      </motion.div>
    ) : (
      <div className="grid gap-6">
        {requests.map((request, index) => (
          <OrderRequestCard key={request.id} request={request} index={index} />
        ))}
      </div>
    )}
  </motion.div>
);
