// ---------------------------------------------------------------------------
// OrderRequestCard
// ---------------------------------------------------------------------------
// A single order card: status badge, date/guests/location meta row, a
// progress tracker (hidden when cancelled), and the total + chevron.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, MapPin, Users } from 'lucide-react';
import type { Request } from '../../types';
import {
  extractStatusFromDescription,
  isCancelled,
  isCompleted,
} from '../../constants/orderStatus';
import { formatDate, formatPrice } from '../../utils/format';
import { OrderProgressTracker } from './OrderProgressTracker';

interface OrderRequestCardProps {
  request: Request;
  /** Position in the list — controls the stagger-in delay. */
  index: number;
}

export const OrderRequestCard: React.FC<OrderRequestCardProps> = ({ request, index }) => {
  // The status shown on the badge may be stashed in the description
  // (backend orders), so extract it for display purposes.
  const displayStatus = extractStatusFromDescription(request.description, request.status);
  const cancelled = isCancelled(displayStatus);
  const completed = isCompleted(displayStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[32px] border border-stone-100 shadow-lg shadow-stone-900/5 hover:shadow-xl hover:shadow-brand-primary/10 transition-all p-8 relative overflow-hidden group"
    >
      {/* Decorative background blur for active cards */}
      {!cancelled && !completed && (
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-brand-primary/10 transition-colors" />
      )}

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 relative z-10">
        {/* Left: title + meta */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h4 className="text-2xl font-serif font-bold text-stone-900">{request.title}</h4>
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                completed
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-500/10'
                  : cancelled
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20'
              }`}
            >
              {displayStatus}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-500 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-brand-primary">
                <Calendar size={14} />
              </div>
              <span className="font-medium text-stone-700">{formatDate(request.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-brand-primary">
                <Users size={14} />
              </div>
              <span className="font-medium text-stone-700">
                {request.guests} {request.guests === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            {request.location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-brand-primary">
                  <MapPin size={14} />
                </div>
                <span className="font-medium text-stone-700">{request.location}</span>
              </div>
            )}
          </div>

          {/* Progress tracker (hidden for cancelled orders) */}
          {!cancelled && <OrderProgressTracker status={request.status} />}
        </div>

        {/* Right: price + chevron */}
        <div className="flex items-center gap-8 lg:border-l lg:border-stone-100 lg:pl-10 flex-shrink-0 self-center lg:self-stretch">
          <div className="text-right">
            <div className="text-3xl font-serif font-bold text-stone-900">{formatPrice(request.budget)}</div>
            <div className="text-xs text-stone-400 uppercase font-bold tracking-widest mt-1">Total Amount</div>
          </div>
          <button className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group-hover:scale-105 shadow-sm">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
