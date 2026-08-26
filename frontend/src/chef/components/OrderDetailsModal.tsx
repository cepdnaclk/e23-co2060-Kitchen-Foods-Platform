import React from 'react';
import { Order } from '../types';
import { X, Clock, User, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: Order['status']) => void;
  /** Opens the bid modal for an open order. */
  onBid?: (order: Order) => void;
}

export const OrderDetailsModal = ({ order, onClose, onStatusChange, onBid }: OrderDetailsModalProps) => {
  const steps = [
    { key: 'pending', label: 'Received' },
    { key: 'quoted', label: 'Assigned' },
    { key: 'preparing', label: 'In Kitchen' },
    { key: 'ready', label: 'Ready for Pickup' },
    { key: 'delivered', label: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  const primaryAction: { label: string; onClick: () => void; cls: string } | null =
    order.status === 'pending' && onBid
      ? { label: 'Place Bid', onClick: () => { onBid(order); onClose(); }, cls: 'bg-gradient-to-r from-brand-primary to-amber-500 text-white hover:shadow-lg hover:shadow-brand-primary/25' }
      : order.status === 'quoted'
      ? { label: 'Start Cooking', onClick: () => { onStatusChange(order.id, 'preparing'); onClose(); }, cls: 'bg-gradient-to-r from-brand-primary to-amber-500 text-white hover:shadow-lg hover:shadow-brand-primary/25' }
      : order.status === 'preparing'
        ? { label: 'Mark Ready', onClick: () => { onStatusChange(order.id, 'ready'); onClose(); }, cls: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25' }
        : order.status === 'ready'
          ? { label: 'Complete Order', onClick: () => { onStatusChange(order.id, 'delivered'); onClose(); }, cls: 'bg-stone-900 hover:bg-stone-800 text-white' }
          : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-lg chef-card rounded-3xl overflow-hidden shadow-2xl z-10"
      >
        {/* Accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-primary to-amber-500" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-900/10 flex items-center justify-between bg-white/60">
          <div>
            <h3 className="text-lg font-display font-bold text-stone-900 tracking-tight">Order Details</h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">{order.id} · {order.customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Progress Timeline */}
          {order.status !== 'cancelled' && (
            <div className="p-4 chef-panel rounded-2xl">
              <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.16em] mb-4">Preparation Flow</h4>
              <div className="flex justify-between items-center relative">
                {/* Connection Line */}
                <div className="absolute left-3 right-3 top-3 h-[2px] bg-stone-200 -z-10" />
                <div
                  className="absolute left-3 top-3 h-[2px] bg-gradient-to-r from-brand-primary to-amber-500 transition-all duration-500 -z-10"
                  style={{ width: `calc(${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}% - 0px)` }}
                />

                {steps.map((step, idx) => {
                  const done = idx <= currentStepIndex;
                  const active = idx === currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 relative">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-tr from-brand-primary to-amber-500 border-brand-primary text-white shadow-lg shadow-brand-primary/40 scale-110'
                          : done
                            ? 'bg-white border-brand-primary/60 text-brand-primary'
                            : 'bg-white border-stone-200 text-stone-400'
                      }`}>
                        {done && !active ? <Check size={11} strokeWidth={3} /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold whitespace-nowrap ${
                        active ? 'text-brand-primary' : done ? 'text-stone-600' : 'text-stone-400'
                      }`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer / Timing Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 chef-panel rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-stone-500 uppercase tracking-[0.14em] block font-bold">Customer</span>
                <span className="text-xs text-stone-900 font-bold block truncate mt-0.5">{order.customerName}</span>
              </div>
            </div>
            <div className="p-3.5 chef-panel rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
                <Clock size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-stone-500 uppercase tracking-[0.14em] block font-bold">Deliver By</span>
                <span className="text-xs text-stone-900 font-bold block truncate mt-0.5">{order.deliveryTime}</span>
              </div>
            </div>
          </div>

          {/* Ordered items list */}
          <div>
            <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.16em] mb-3">Items Summary</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm p-3 bg-white/60 border border-stone-900/10 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary font-mono font-bold text-xs rounded-md border border-brand-primary/20 shrink-0">
                      {item.quantity}
                    </span>
                    <span className="text-stone-700 font-semibold truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-stone-900 whitespace-nowrap ml-2">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description / Notes */}
          {order.description && (
            <div className="p-4 chef-panel rounded-2xl">
              <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.16em] mb-1.5">Chef Notes & Requests</h4>
              <p className="text-xs text-stone-600 leading-relaxed italic">"{order.description}"</p>
            </div>
          )}

          {/* Pricing Total */}
          <div className="flex justify-between items-center p-4 bg-stone-100 border border-stone-900/10 rounded-2xl">
            <span className="text-sm font-semibold text-stone-500">Total Price (incl. tax)</span>
            <span className="text-xl font-display font-bold text-stone-900 tabular-nums">Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-stone-900/10 bg-white/60 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-stone-300 hover:border-stone-400 text-stone-600 hover:text-stone-900 rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 ${primaryAction.cls}`}
            >
              {primaryAction.label} <ArrowRight size={12} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
