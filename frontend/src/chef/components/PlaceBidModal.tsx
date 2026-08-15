import React, { useState } from 'react';
import { HandCoins, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';

interface PlaceBidModalProps {
  order: Order;
  existingQuote?: { price: number; note: string | null; fulfillmentTime: string | null } | null;
  onClose: () => void;
  onSubmit: (data: { price: number; note: string; fulfillmentTime: string }) => void;
}

export const PlaceBidModal = ({ order, existingQuote, onClose, onSubmit }: PlaceBidModalProps) => {
  const [price, setPrice] = useState(existingQuote ? String(existingQuote.price) : '');
  const [fulfillmentTime, setFulfillmentTime] = useState(existingQuote?.fulfillmentTime || '');
  const [note, setNote] = useState(existingQuote?.note || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(price);
    if (!price || Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a valid bid price');
      return;
    }
    onSubmit({ price: parsed, note: note.trim(), fulfillmentTime: fulfillmentTime.trim() });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-md chef-card rounded-3xl overflow-hidden shadow-2xl z-10"
      >
        <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-primary to-amber-500" />

        <div className="p-6 pb-3 border-b border-stone-900/10 flex items-center justify-between bg-white/60">
          <div>
            <h3 className="text-base font-display font-bold text-stone-900">
              {existingQuote ? 'Update Your Bid' : 'Place a Bid'}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5 font-mono">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Order summary */}
          <div className="p-3.5 chef-panel rounded-2xl">
            <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
              {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ') || order.description || 'Custom request'}
            </p>
            <p className="text-[10px] text-stone-500 mt-1.5">
              Deliver by {order.deliveryTime} · {order.customerName}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">
              Your Total Price (LKR) *
            </label>
            <input
              type="number"
              min="0"
              step="any"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1800"
              className="chef-input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">
              Estimated Fulfillment Time
            </label>
            <input
              type="text"
              value={fulfillmentTime}
              onChange={(e) => setFulfillmentTime(e.target.value)}
              placeholder="e.g. 13:30 or 'Within 2 hours'"
              className="chef-input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">
              Message / Menu Breakdown
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what the customer gets — dishes, portions, inclusions..."
              className="chef-input resize-none"
            />
          </div>

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

          <div className="pt-4 flex justify-end gap-3 border-t border-stone-900/10">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-full text-xs font-bold hover:bg-stone-50 hover:text-stone-900 transition-all">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-brand-primary text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all active:scale-95 flex items-center gap-1.5">
              <HandCoins size={13} />
              {existingQuote ? 'Update Bid' : 'Submit Bid'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
