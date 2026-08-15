// ---------------------------------------------------------------------------
// useCustomerOrders
// ---------------------------------------------------------------------------
// Loads the logged-in customer's orders and keeps them fresh by polling the
// backend every 30 seconds, so status changes appear while the user browses
// the site. Also exposes setRequests so the menu section can prepend a
// newly placed order without a refetch.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const userId = getStoredUserId();
    if (!userId) return; // not logged in — nothing to fetch

    let active = true;

    const load = async () => {
      try {
        const orders = await fetchCustomerOrders(userId);
        if (active) setRequests(orders);
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      }
    };

    void load();
    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return { requests, setRequests };
}
