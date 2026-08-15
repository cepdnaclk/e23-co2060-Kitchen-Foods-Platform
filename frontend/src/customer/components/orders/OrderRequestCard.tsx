// ---------------------------------------------------------------------------
// OrderRequestCard
// ---------------------------------------------------------------------------
// A single order card: status badge, date/guests/location meta row, a
// progress tracker (hidden when cancelled), and the total + chevron.
//
// For orders still open for bidding (Pending) it also shows the incoming
// chef quotes (sorted by price) with an Accept button, and a Cancel button.
// ---------------------------------------------------------------------------

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Check, ChevronRight, HandCoins, MapPin, Users, X } from 'lucide-react';
import type { Request } from '../../types';
import {
  extractStatusFromDescription,
  isCancelled,
  isCompleted,
  isExpired,
} from '../../constants/orderStatus';
import { formatDate, formatPrice } from '../../utils/format';
import {
  acceptQuote,
  cancelOrder,
  fetchOrderQuotes,
  type Quote,
} from '../../services/customerApi';
import { OrderProgressTracker } from './OrderProgressTracker';

interface OrderRequestCardProps {
  request: Request;
  /** Position in the list — controls the stagger-in delay. */
  index: number;
  /** Called after an accept/cancel so the parent can reload orders. */
  onRefresh?: () => void;
}

function getCustomerId(): string | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return (JSON.parse(raw) as { uid?: string }).uid ?? null;
  } catch {
    return null;
  }
}

export const OrderRequestCard: React.FC<OrderRequestCardProps> = ({ request, index, onRefresh }) => {
  // The status shown on the badge may be stashed in the description
  // (backend orders), so extract it for display purposes.
  const displayStatus = extractStatusFromDescription(request.description, request.status);
  const cancelled = isCancelled(displayStatus);
  const completed = isCompleted(displayStatus);
  const expired = isExpired(displayStatus);
  const isOpen = displayStatus.toLowerCase() === 'pending';

  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [actionError, setActionError] = useState('');

  // Load incoming quotes while the order is still open for bidding.
  useEffect(() => {
    let active = true;
    setQuotes(null);
    setActionError('');
    if (!isOpen) return;

    fetchOrderQuotes(request.id)
      .then((data) => {
        if (active) setQuotes(data);
      })
      .catch(() => {
        if (active) setQuotes([]);
      });

    return () => {
      active = false;
    };
  }, [request.id, isOpen]);

  const handleAccept = useCallback(
    async (quoteId: string) => {
      const customerId = getCustomerId();
      if (!customerId) {
        setActionError('Please log in to accept a quote');
        return;
      }
      if (!window.confirm('Accept this quote? The order will be assigned to this chef and other quotes will be rejected.')) {
        return;
      }
      try {
        await acceptQuote(request.id, quoteId, customerId);
        setActionError('');
        onRefresh?.();
      } catch (err) {
        setActionError((err as Error).message || 'Failed to accept quote');
      }
    },
    [request.id, onRefresh],
  );

  const handleCancel = useCallback(async () => {
    const customerId = getCustomerId();
    if (!customerId) {
      setActionError('Please log in to cancel an order');
      return;
    }
    if (!window.confirm('Cancel this request? All active chef quotes will be voided.')) {
      return;
    }
    try {
      await cancelOrder(request.id, customerId);
      setActionError('');
      onRefresh?.();
    } catch (err) {
      setActionError((err as Error).message || 'Failed to cancel order');
    }
  }, [request.id, onRefresh]);

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
                  : cancelled || expired
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : displayStatus.toLowerCase() === 'quoted'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
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
            {isOpen && typeof request.bids === 'number' && request.bids > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <HandCoins size={14} />
                </div>
                <span className="font-medium text-stone-700">{request.bids} bid{request.bids === 1 ? '' : 's'}</span>
              </div>
            )}
          </div>

          {/* Progress tracker (hidden for cancelled/expired orders) */}
          {!cancelled && !expired && <OrderProgressTracker status={displayStatus} />}

          {/* Incoming quotes — only while the order is open for bidding */}
          {isOpen && (
            <div className="mt-8">
              <h5 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                <HandCoins size={14} className="text-brand-primary" />
                Incoming Quotes
              </h5>

              {quotes === null ? (
                <div className="flex items-center gap-3 text-sm text-stone-400 py-4">
                  <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  Loading quotes...
                </div>
              ) : quotes.length === 0 ? (
                <div className="py-5 px-5 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-sm text-stone-500">
                  No quotes yet — chefs are reviewing your request.
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-stone-50/80 border border-stone-100 rounded-2xl"
                    >
                      {/* Chef identity */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {quote.chefAvatar ? (
                          <img
                            src={quote.chefAvatar}
                            alt={quote.chefName || 'Chef'}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-primary/40"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-primary to-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {(quote.chefName || 'C').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-900 truncate">{quote.chefName || 'Home Chef'}</p>
                          {quote.fulfillmentTime && (
                            <p className="text-xs text-stone-500 truncate">Fulfills by {quote.fulfillmentTime}</p>
                          )}
                        </div>
                      </div>

                      {/* Quote body */}
                      <div className="flex-1 min-w-0">
                        {quote.note && (
                          <p className="text-xs text-stone-500 italic line-clamp-2">"{quote.note}"</p>
                        )}
                      </div>

                      {/* Price + accept */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-lg font-serif font-bold text-stone-900">
                            {formatPrice(quote.price)}
                          </div>
                          <div className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Bid</div>
                        </div>
                        <button
                          onClick={() => handleAccept(quote.id)}
                          className="px-5 py-2.5 bg-brand-primary text-white rounded-full text-xs font-bold shadow-md shadow-brand-primary/25 hover:shadow-lg hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                        >
                          <Check size={13} /> Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {actionError && <p className="mt-4 text-xs font-medium text-rose-600">{actionError}</p>}
        </div>

        {/* Right: price + actions */}
        <div className="flex flex-col items-end gap-4 lg:border-l lg:border-stone-100 lg:pl-10 flex-shrink-0 self-center lg:self-stretch">
          <div className="text-right">
            <div className="text-3xl font-serif font-bold text-stone-900">{formatPrice(request.budget)}</div>
            <div className="text-xs text-stone-400 uppercase font-bold tracking-widest mt-1">Total Amount</div>
          </div>
          {isOpen && (
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-all"
            >
              <X size={13} /> Cancel Request
            </button>
          )}
          <button
            className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group-hover:scale-105 shadow-sm"
            aria-label="View order details"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
