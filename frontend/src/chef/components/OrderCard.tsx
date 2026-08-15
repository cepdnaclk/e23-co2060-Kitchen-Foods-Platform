import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { Clock, CheckCircle2, ChefHat, Package, AlertCircle, ArrowRight, Eye, HandCoins, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: Order['status']) => void;
  onViewDetails?: (order: Order) => void;
  /** Opens the bid modal for an open order. */
  onBid?: (order: Order) => void;
  /** The current chef's bid on this order, if any. */
  myQuote?: { price: number; status: string } | null;
}

const statusConfig: Record<Order['status'], {
  icon: typeof AlertCircle;
  chip: string;
  tile: string;
  label: string;
}> = {
  pending: {
    icon: AlertCircle,
    chip: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    tile: 'bg-amber-500/10 text-amber-600 border-amber-500/25',
    label: 'Open for Bids',
  },
  quoted: {
    icon: HandCoins,
    chip: 'bg-orange-500/10 text-brand-primary border-brand-primary/30',
    tile: 'bg-brand-primary/10 text-brand-primary border-brand-primary/25',
    label: 'Assigned',
  },
  preparing: {
    icon: ChefHat,
    chip: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    tile: 'bg-blue-500/10 text-blue-600 border-blue-500/25',
    label: 'Preparing',
  },
  ready: {
    icon: Package,
    chip: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    tile: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
    label: 'Ready',
  },
  delivered: {
    icon: CheckCircle2,
    chip: 'bg-stone-500/10 text-stone-500 border-stone-500/30',
    tile: 'bg-stone-500/10 text-stone-500 border-stone-500/25',
    label: 'Completed',
  },
  cancelled: {
    icon: XCircle,
    chip: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    tile: 'bg-rose-500/10 text-rose-600 border-rose-500/25',
    label: 'Cancelled',
  },
  expired: {
    icon: XCircle,
    chip: 'bg-stone-500/10 text-stone-500 border-stone-500/30',
    tile: 'bg-stone-500/10 text-stone-500 border-stone-500/25',
    label: 'Expired',
  },
};

export const OrderCard = ({ order, onStatusChange, onViewDetails, onBid, myQuote }: OrderCardProps) => {
  const config = statusConfig[order.status] ?? statusConfig.pending;
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'expired') {
      setTimeLeft('');
      return;
    }

    const minutes = Math.floor(10 + (parseInt(order.id.replace(/\D/g, ''), 10) || 5) % 35);
    let secondsLeft = minutes * 60;

    const interval = setInterval(() => {
      if (secondsLeft <= 0) {
        setTimeLeft('Overdue!');
        clearInterval(interval);
      } else {
        secondsLeft--;
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        setTimeLeft(`${m}m ${s < 10 ? '0' : ''}${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order.id, order.status]);

  const hasActiveBid = myQuote && myQuote.status === 'Pending';
  const bidRejected = myQuote && myQuote.status === 'Rejected';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={`p-5 rounded-2xl chef-card ${
        order.status === 'pending' ? 'chef-order-pulse' : ''
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2.5 rounded-xl border ${config.tile} shrink-0`}>
            <config.icon size={17} className="stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-stone-900 tracking-tight font-mono">{order.id}</h4>
              <span className={`chef-chip ${config.chip}`}>{config.label}</span>
            </div>
            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 truncate">{order.customerName}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="flex items-center gap-1.5 justify-end text-xs font-semibold text-stone-500">
            <Clock size={12} className="text-stone-400" />
            <span>{order.deliveryTime}</span>
          </div>
          {timeLeft && (
            <span className="inline-flex items-center gap-1 text-[10px] text-brand-primary font-bold bg-brand-primary/10 px-2 py-0.5 rounded-full border border-brand-primary/25 mt-1 animate-pulse">
              ⏱ {timeLeft}
            </span>
          )}
        </div>
      </div>

      {/* Bid status strip */}
      {order.status === 'pending' && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {hasActiveBid && (
            <span className="chef-chip bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              Your bid: Rs. {myQuote!.price.toLocaleString()}
            </span>
          )}
          {bidRejected && (
            <span className="chef-chip bg-rose-500/10 text-rose-600 border-rose-500/30">
              Bid rejected — order closed
            </span>
          )}
          {typeof order.quoteCount === 'number' && order.quoteCount > 0 && (
            <span className="chef-chip bg-stone-500/10 text-stone-600 border-stone-500/30">
              {order.quoteCount} bid{order.quoteCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
      )}

      {/* Items */}
      <div className="space-y-1.5 mb-4 py-2 border-t border-b border-stone-900/10">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs">
            <span className="text-stone-700 font-medium truncate pr-2">
              <span className="text-brand-primary font-bold mr-1.5 tabular-nums">{item.quantity}x</span> {item.name}
            </span>
            <span className="font-semibold text-stone-800 whitespace-nowrap tabular-nums">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {order.description && (
        <div className="mb-4 p-2.5 bg-stone-100/80 border border-stone-900/10 rounded-xl text-[11px] text-stone-500">
          <span className="font-bold text-stone-700 block mb-0.5">Note:</span>
          <p className="line-clamp-2 italic">"{order.description}"</p>
        </div>
      )}

      {/* Footer */}
      <div className="pt-1 flex items-center justify-between gap-3">
        <div className="text-xs">
          <span className="text-stone-500 font-medium">Total:</span>
          <span className="ml-1.5 font-display font-bold text-stone-900">Rs. {order.total.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(order)}
              className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 rounded-lg transition-colors border border-stone-900/10"
              title="View Details"
            >
              <Eye size={14} />
            </button>
          )}

          {order.status === 'pending' && onBid && (
            <button
              onClick={() => onBid(order)}
              className="px-3.5 py-2 bg-gradient-to-r from-brand-primary to-amber-500 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <HandCoins size={13} /> {hasActiveBid ? 'Update Bid' : 'Place Bid'}
            </button>
          )}
          {order.status === 'quoted' && (
            <button
              onClick={() => onStatusChange(order.id, 'preparing')}
              className="px-3.5 py-2 bg-gradient-to-r from-brand-primary to-amber-500 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              Start Cooking <ArrowRight size={12} />
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusChange(order.id, 'ready')}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              Ready <ArrowRight size={12} />
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => onStatusChange(order.id, 'delivered')}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg active:scale-95 transition-all"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
