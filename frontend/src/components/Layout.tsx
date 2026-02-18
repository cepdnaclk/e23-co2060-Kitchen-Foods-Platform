import React, { useState } from 'react';
import { ChefHat, Plus, LogOut, User, Calendar, DollarSign, Utensils, Star, Clock, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
export type ViewState = 'login' | 'dashboard' | 'create-request' | 'request-details';

export interface Request {
  id: string;
  title: string;
  date: string;
  guests: number;
  budget: number;
  status: 'open' | 'accepted' | 'completed';
  bids: number;
  location: string;
  dietary: string[];
  description?: string;
}

export interface ChefBid {
  id: string;
  chefName: string;
  chefImage: string;
  price: number;
  rating: number;
  specialties: string[];
  recentMeals: string[];
  description: string;
}

// Mock Data
export const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    title: 'Anniversary Dinner',
    date: '2026-02-11',
    guests: 4,
    budget: 3300,
    status: 'open',
    bids: 3,
    location: 'Colombo',
    dietary: ['Gluten-Free']
  },
  {
    id: '2',
    title: 'Team Lunch',
    date: '2026-02-12',
    guests: 12,
    budget: 12500,
    status: 'open',
    bids: 5,
    location: 'Kandy',
    dietary: ['Vegetarian Options']
  }
];

export const MOCK_BIDS: ChefBid[] = [
  {
    id: 'b1',
    chefName: 'Sumanalatha',
    chefImage: 'https://images.unsplash.com/photo-1560827210-168a544dbd4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 3350,
    rating: 4.9,
    specialties: ['Sri Lankan', 'Seafood'],
    recentMeals: [
      'https://images.unsplash.com/photo-1628838463043-b81a343794d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1637316659418-90dadfb82843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1544025162-d76690b6d012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
    ],
    description: 'Specializing in authentic coastal Sri Lankan cuisine using locally sourced ingredients.'
  },
  {
    id: 'b2',
    chefName: 'Samantha',
    chefImage: 'https://images.unsplash.com/photo-1723747338983-da5fd1d09904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 12800,
    rating: 4.7,
    specialties: ['Asian Fusion', 'Modern French'],
    recentMeals: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
    ],
    description: 'Combining traditional techniques with modern flavors to create unforgettable dining experiences.'
  },
  {
    id: 'b3',
    chefName: 'Pablis',
    chefImage: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 13320,
    rating: 4.8,
    specialties: ['Farm-to-Table', 'Italian'],
    recentMeals: [
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
    ],
    description: 'Passionate about sustainable cooking and creating hearty, comforting meals.'
  }
];

// Context
interface AppContextType {
  view: ViewState;
  setView: (view: ViewState) => void;
  selectedRequest: Request | null;
  setSelectedRequest: (req: Request | null) => void;
  requests: Request[];
  addRequest: (req: Request) => void;
}

export const AppContext = React.createContext<AppContextType>({
  view: 'login',
  setView: () => { },
  selectedRequest: null,
  setSelectedRequest: () => { },
  requests: [],
  addRequest: () => { },
});

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { view, setView } = React.useContext(AppContext);

  if (view === 'login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setView('dashboard')}
          >
            <div className="bg-orange-600 text-white p-1.5 rounded-lg">
              <ChefHat size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">KitchenFoods</span>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => setView('dashboard')}
              className={`text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-orange-600' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              My Requests
            </button>
            <button className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
              Messages
            </button>
            <div className="flex items-center gap-2 pl-6 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
                <User size={16} />
              </div>
              <button
                onClick={() => setView('login')}
                className="text-sm font-medium text-neutral-500 hover:text-red-600 flex items-center gap-1"
              >
                <LogOut size={14} />
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
};
