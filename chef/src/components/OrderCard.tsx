import React from 'react';
import { Order } from '../types';
import { Clock, CheckCircle2, ChefHat, Package, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: Order['status']) => void;
  key?: string | number;
}

const statusConfig = {
  pending: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'New Order' },
  preparing: { icon: ChefHat, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Preparing' },
  ready: { icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Ready for Pickup' },
  delivered: { icon: CheckCircle2, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', label: 'Delivered' },
  cancelled: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Cancelled' },
};

export const OrderCard = ({ order, onStatusChange }: OrderCardProps) => {
  const config = statusConfig[order.status];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm ${order.status === 'pending' ? 'order-pulse ring-2 ring-orange-500/20' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
            <config.icon size={18} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{order.id}</h4>
            <p className="text-xs text-slate-500">{order.customerName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-1">
            <Clock size={12} />
            <span>Due {order.deliveryTime}</span>
          </div>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-slate-600">
              <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
            </span>
            <span className="font-medium text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-slate-500">Total:</span>
          <span className="ml-1 font-bold text-slate-900">Rs. {order.total.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <button 
              onClick={() => onStatusChange(order.id, 'preparing')}
              className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Accept
            </button>
          )}
          {order.status === 'preparing' && (
            <button 
              onClick={() => onStatusChange(order.id, 'ready')}
              className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button 
              onClick={() => onStatusChange(order.id, 'delivered')}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
