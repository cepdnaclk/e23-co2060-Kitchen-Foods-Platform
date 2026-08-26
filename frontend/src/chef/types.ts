export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'quoted' | 'expired';

export interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryTime: string;
  description?: string;
  /** Number of active (Pending) bids on an open order — shown on the feed. */
  quoteCount?: number;
}

/** A chef's bid on an order, as returned by GET /quotes/chef/:chefId. */
export interface ChefQuote {
  id: string;
  orderId: string;
  chefId: string;
  price: number;
  note: string | null;
  fulfillmentTime: string | null;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
  customerName: string | null;
  orderStatus: string | null;
  orderDescription: string | null;
  deliveryDate: string | null;
  deliveryTime: string | null;
}

export interface ChefStats {
  totalEarnings: number;
  totalOrders: number;
  averageRating: number;
  activeOrders: number;
  earningsHistory: { date: string; amount: number }[];
}

export interface ChefProfile {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  location: string;
  bio: string;
  email?: string;
}
