import { Order, ChefStats, ChefProfile } from './types';
import { subDays, format } from 'date-fns';

export const mockChefProfile: ChefProfile = {
  id: "u3",
  name: "Ranjan Ramanayake",
  specialty: "Traditional Sri Lankan Cuisine",
  avatar: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
  location: "Colombo, Sri Lanka",
  bio: "Passionate about bringing authentic Sri Lankan flavors to your home. Specializing in rice and curry, hoppers, and spicy seafood delicacies."
};

export const mockOrders: Order[] = [
  {
    id: "ORD-7281",
    customerName: "Alex Johnson",
    items: [
      { name: "Chicken Curry & Rice", quantity: 2, price: 850.00 },
      { name: "Pol Sambol", quantity: 1, price: 150.00 }
    ],
    total: 1850.00,
    status: "preparing",
    createdAt: new Date().toISOString(),
    deliveryTime: "6:30 PM"
  },
  {
    id: "ORD-7282",
    customerName: "Sarah Miller",
    items: [
      { name: "Egg Hoppers (Set of 4)", quantity: 1, price: 600.00 },
      { name: "Ginger Tea", quantity: 2, price: 150.00 }
    ],
    total: 900.00,
    status: "pending",
    createdAt: new Date().toISOString(),
    deliveryTime: "7:00 PM"
  },
  {
    id: "ORD-7279",
    customerName: "Michael Chen",
    items: [
      { name: "Vegetable Kottu", quantity: 1, price: 750.00 }
    ],
    total: 750.00,
    status: "ready",
    createdAt: subDays(new Date(), 0).toISOString(),
    deliveryTime: "5:45 PM"
  },
  {
    id: "ORD-7275",
    customerName: "David Perera",
    items: [
      { name: "Fish Ambul Thiyal", quantity: 1, price: 1100.00 },
      { name: "Red Rice", quantity: 1, price: 200.00 }
    ],
    total: 1300.00,
    status: "delivered",
    createdAt: subDays(new Date(), 1).toISOString(),
    deliveryTime: "Completed"
  },
  {
    id: "ORD-7270",
    customerName: "Nimal Siriwardena",
    items: [
      { name: "Mutton Paal Poriyal", quantity: 2, price: 1500.00 }
    ],
    total: 3000.00,
    status: "delivered",
    createdAt: subDays(new Date(), 2).toISOString(),
    deliveryTime: "Completed"
  }
];

export const mockStats: ChefStats = {
  totalEarnings: 45250.00,
  totalOrders: 142,
  averageRating: 4.9,
  activeOrders: 3,
  earningsHistory: Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM dd'),
    amount: Math.floor(Math.random() * 5000) + 2000
  }))
};
