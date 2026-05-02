export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryTime: string;
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
}
