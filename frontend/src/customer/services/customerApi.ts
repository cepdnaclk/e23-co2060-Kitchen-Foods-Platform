// ---------------------------------------------------------------------------
// Customer API client
// ---------------------------------------------------------------------------
// Every backend call the customer app makes lives here, so components and
// hooks never talk to `fetch` directly. This keeps the endpoint list and
// response-mapping logic in one place.
// ---------------------------------------------------------------------------

import { API_BASE_URL } from '../../shared/api';
import type { FoodCategory, FoodItem, Request, Stats } from '../types';

/** Raw order shape returned by the backend (snake_case). */
export interface BackendOrder {
  id: string;
  foodItemName?: string;
  deliveryDate?: string;
  createdAt: string;
  quantity?: number;
  totalPrice?: number | string;
  status: string;
  mealDescription?: string;
}

/** Payload sent to the backend when placing an order. */
export interface PlaceOrderPayload {
  customerId: string;
  chefId?: string | null;
  foodItemId?: string;
  quantity: number;
  totalPrice: number;
  deliveryDate?: string;
  deliveryTime: string;
  mealDescription: string;
}

/** Map a backend order into the frontend's Request shape. */
function mapBackendOrder(o: BackendOrder): Request {
  return {
    id: o.id,
    title: o.foodItemName || 'Ordered Item',
    date: o.deliveryDate
      ? o.deliveryDate.split('T')[0]
      : new Date(o.createdAt).toISOString().split('T')[0],
    guests: o.quantity || 1,
    budget: Number(o.totalPrice) || 0,
    status: o.status,
    bids: 0,
    location: 'Colombo',
    dietary: [],
    // The status is stashed inside the description so the order card can
    // render it without a schema change (see utils/orderStatus.ts).
    description: `${o.mealDescription || ''} STATUS: ${o.status}`,
  };
}

/** Fetch all food categories, keeping 'Other' last in the list. */
export async function fetchCategories(): Promise<FoodCategory[]> {
  const res = await fetch(`${API_BASE_URL}/food/categories`);
  if (!res.ok) throw new Error('Failed to load menu categories');
  const categories = (await res.json()) as FoodCategory[];
  return [...categories].sort((a, b) => {
    if (a.name.toLowerCase() === 'other') return 1;
    if (b.name.toLowerCase() === 'other') return -1;
    return 0;
  });
}

/** Fetch all published food items. */
export async function fetchFoodItems(): Promise<FoodItem[]> {
  const res = await fetch(`${API_BASE_URL}/food`);
  if (!res.ok) throw new Error('Failed to load food items');
  return (await res.json()) as FoodItem[];
}

/** Fetch the logged-in customer's orders (polled by useCustomerOrders). */
export async function fetchCustomerOrders(customerId: string): Promise<Request[]> {
  const res = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const orders = (await res.json()) as BackendOrder[];
  return orders.map(mapBackendOrder);
}

/** Create a new order. Resolves with the created order (we only use its id). */
export async function placeOrder(payload: PlaceOrderPayload): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || 'Failed to place order');
  }
  return (await res.json()) as { id: string };
}

/** Fetch homepage impact statistics. */
export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return (await res.json()) as Stats;
}
