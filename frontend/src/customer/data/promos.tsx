// ---------------------------------------------------------------------------
// Promo banner data
// ---------------------------------------------------------------------------
// Static promotional slides for the rotating PromoBanner carousel.
// (Kept in a .tsx file because each promo carries JSX icons.)
// ---------------------------------------------------------------------------

import type { ReactNode } from 'react';
import { Flame, Gift, Zap } from 'lucide-react';

export interface Promo {
  id: number;
  tag: string;
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
  stats: string[];
  color: string;
}

export const PROMOS: Promo[] = [
  {
    id: 1,
    tag: 'Special Offer',
    icon: <Zap size={20} className="fill-current" />,
    title: 'Chef of the Month: \nAunty Kamala\'s Kitchen',
    description:
      "Experience the authentic taste of Jaffna with Auntie Kamala's signature spice blends. Exclusive 20% discount this week.",
    image: '/src/assets/aunty-kamala.jpg',
    stats: ['4.9 Rating', '120+ Orders'],
    color: 'from-brand-primary/20 to-transparent',
  },
  {
    id: 2,
    tag: 'Limited Time',
    icon: <Flame size={20} className="fill-current" />,
    title: 'Weekend Seafood \nExtravaganza',
    description:
      'Fresh catch from the Negombo coast delivered to your doorstep. Try our Lagoon Crab Curry at special rates.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    stats: ['Fresh Catch', 'Premium Quality'],
    color: 'from-blue-500/20 to-transparent',
  },
  {
    id: 3,
    tag: 'New Arrival',
    icon: <Gift size={20} className="fill-current" />,
    title: 'Traditional Sweets \nGift Boxes',
    description:
      'Perfect for sharing. Our new curated collection of Watalappam and Kevum is here to sweeten your celebrations.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80',
    stats: ['Handmade', 'Gift Ready'],
    color: 'from-pink-500/20 to-transparent',
  },
];
