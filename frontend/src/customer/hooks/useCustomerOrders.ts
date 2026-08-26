// ---------------------------------------------------------------------------
// useCustomerOrders
// ---------------------------------------------------------------------------
// Loads the logged-in customer's orders and keeps them fresh by polling the
// backend every 30 seconds, so status changes appear while the user browses
// the site. Also exposes setRequests so the menu section can prepend a
// newly placed order without a refetch, and refresh so quote accept/cancel
// actions can reload immediately.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCustomerOrders } from '../services/customerApi';
import type { Request } from '../types';

/** How often (ms) to re-fetch the customer's orders. */
const POLL_INTERVAL_MS = 30_000;

/** Read the stored customer record from localStorage (set at login). */
function getStoredUserId(): string | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw) as { uid?: string };
    return user.uid ?? null;
  } catch {
    return null;
  }
}

export function useCustomerOrders() {
  const [requests, setRequests] = useState<Request[]>([]);
  const userIdRef = useRef<string | null>(getStoredUserId());

  const refresh = useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId) return; // not logged in — nothing to fetch
    try {
      const orders = await fetchCustomerOrders(userId);
      setRequests(orders);
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    }
  }, []);

  useEffect(() => {
    const userId = userIdRef.current;
    if (!userId) return;

    void refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refresh]);

  return { requests, setRequests, refresh };
}
