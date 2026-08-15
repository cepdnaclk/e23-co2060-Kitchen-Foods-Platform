import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { Clock, CheckCircle2, ChefHat, Package, AlertCircle, ArrowRight, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: Order['status']) => void;
  onViewDetails?: (order: Order) => void;
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
    label: 'New Order',
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
    icon: AlertCircle,
    chip: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    tile: 'bg-rose-500/10 text-rose-600 border-rose-500/25',
    label: 'Cancelled',
  },
};

export const OrderCard = ({ order, onStatusChange, onViewDetails }: OrderCardProps) => {
  const config = statusConfig[order.status] ?? statusConfig.pending;
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (order.status === 'delivered' || order.status === 'cancelled') {
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

          {order.status === 'pending' && (
            <button
              onClick={() => onStatusChange(order.id, 'preparing')}
              className="px-3.5 py-2 bg-gradient-to-r from-brand-primary to-amber-500 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              Accept <ArrowRight size={12} />
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
