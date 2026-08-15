import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../shared/api';
import { ImageUploader } from '../shared/ImageUploader';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { OrderCard } from './components/OrderCard';
import { EarningsChart } from './components/EarningsChart';
import { NewOrderToast } from './components/NewOrderToast';
import { OrderDetailsModal } from './components/OrderDetailsModal';

import { Order, ChefProfile } from './types';
import { subDays, format } from 'date-fns';
import { 
  DollarSign, 
  ShoppingBag, 
  Star, 
  Clock, 
  Search, 
  Bell, 
  Plus,
  MapPin,
  ChevronRight,
  Utensils,
  Settings,
  Menu,
  Activity,
  CheckCircle,
  Eye,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './index.css';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Menu Item Type
interface CustomFoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  prepTime: string;
  description: string;
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<ChefProfile>(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      return {
        id: userObj.uid || '',
        name: userObj.full_name || '',
        specialty: userObj.specialty || '',
        avatar: userObj.profile_img_url || '',
        location: userObj.location || '',
        bio: userObj.bio || '',
        email: userObj.email || '',
      };
    }
    return {
      id: '',
      name: '',
      specialty: '',
      avatar: '',
      location: '',
      bio: '',
      email: '',
    };
  });

  const [showToast, setShowToast] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Advanced States
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemImageUrl, setNewItemImageUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [menuItems, setMenuItems] = useState<CustomFoodItem[]>([]);

  // Keep the avatar editor in sync with the loaded profile.
  useEffect(() => {
    setAvatarUrl(profile.avatar);
  }, [profile.avatar]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string; name: string}[]>([]);


  // Fetch this chef's real food items from the DB
  useEffect(() => {
    if (!profile.id) return;
    const fetchMenuItems = async () => {
      setMenuLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/food`);
        if (!res.ok) throw new Error('Failed to fetch menu items');
        const data = await res.json();
        // Filter only items belonging to this chef
        const chefItems: CustomFoodItem[] = data
          .filter((item: any) => item.chefId === profile.id)
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            category: item.categoryName || 'Uncategorised',
            imageUrl: item.imageUrl || '',
            prepTime: '',
            description: item.description || '',
          }));
        setMenuItems(chefItems);
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenuItems();
  }, [profile.id]);

  // Fetch food categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/food/categories`);
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data.map((c: any) => ({ id: c.id, name: c.name })));
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentView('Dashboard');
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/chef/${profile.id}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        
        const transformedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          customerName: o.customerName || "Customer",
          items: [{ 
            name: o.foodItemName || o.mealDescription || "Custom Order", 
            quantity: o.quantity || 1, 
            price: o.quantity > 0 ? Number(o.totalPrice) / o.quantity : Number(o.totalPrice) 
          }],
          total: Number(o.totalPrice) || 0,
          status: (o.status?.toLowerCase() ?? 'pending') as Order['status'],
          createdAt: o.createdAt,
          deliveryTime: o.deliveryTime || "ASAP",
          description: o.mealDescription
        }));

        setOrders(transformedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [profile.id]);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      ...profile,
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      location: formData.get('location') as string,
      bio: formData.get('bio') as string,
      avatar: formData.get('avatar') as string,
    };
    setProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      let response: Response;

      if (status === 'preparing') {
        response = await fetch(`${API_BASE_URL}/orders/${id}/claim`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chefId: profile.id }),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status.charAt(0).toUpperCase() + status.slice(1) }),
        });
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update status");
      }

      setOrders(prev => prev.map(order =>
        order.id === id ? { ...order, status } : order
      ));
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert(err.message || "Failed to update order status");
    }
  };



  const handleAddNewItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const categoryId = formData.get('category') as string;
    const imageUrl = newItemImageUrl;
    const description = formData.get('description') as string;

    try {
      const res = await fetch(`${API_BASE_URL}/food/chef`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price,
          chefId: profile.id,
          imageUrl,
          categoryId,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add food item');
      }
      const saved = await res.json();
      const newItem: CustomFoodItem = {
        id: saved.id,
        name: saved.name,
        price: Number(saved.price),
        category: saved.categoryName || categoryId,
        imageUrl: saved.imageUrl || '',
        prepTime: '',
        description: saved.description || '',
      };
      setMenuItems(prev => [...prev, newItem]);
      setNewItemImageUrl('');
      setIsAddItemModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add item');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/food/chef/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chefId: profile.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete item');
      }
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  const pendingColumn = activeOrders.filter(o => o.status === 'pending');
  const preparingColumn = activeOrders.filter(o => o.status === 'preparing');
  const readyColumn = activeOrders.filter(o => o.status === 'ready');

  const totalEarnings = completedOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;

  const earningsHistory = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateLabel = format(d, 'MMM dd');
    const datePrefix = format(d, 'yyyy-MM-dd');
    
    const amount = completedOrders
      .filter(o => o.status === 'delivered' && o.createdAt && o.createdAt.startsWith(datePrefix))
      .reduce((sum, o) => sum + o.total, 0);
      
    return {
      date: dateLabel,
      amount
    };
  });

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Earnings" 
          value={`Rs. ${totalEarnings.toLocaleString()}`} 
          icon={DollarSign} 
          color="emerald"
        />
        <StatsCard 
          label="Total Orders" 
          value={totalOrdersCount} 
          icon={ShoppingBag} 
          color="orange"
        />
        <StatsCard 
          label="Completed Orders" 
          value={completedOrders.filter(o => o.status === 'delivered').length} 
          icon={CheckCircle} 
          color="amber"
        />
        <StatsCard 
          label="Active Orders" 
          value={activeOrders.length} 
          icon={Clock} 
          color="blue"
        />
      </div>

      <div className="space-y-8">
        {/* Earnings Graph */}
        <section className="p-6 bg-slate-900 border border-slate-800/80 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-white tracking-tight">Earnings Over Time</h2>
              <p className="text-xs text-slate-400">Track your daily income</p>
            </div>
            <div className="flex bg-slate-955 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400">Last 7 Days</span>
            </div>
          </div>
          <EarningsChart data={earningsHistory} />
        </section>

        {/* Mini Kanban Row */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-display font-bold text-white tracking-tight">Interactive Pipeline</h2>
              <p className="text-xs text-slate-400">Advance orders by clicking actions</p>
            </div>
            <button 
              onClick={() => setCurrentView('Orders')}
              className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 rounded-xl transition-all border border-orange-500/20"
            >
              Expand View <ChevronRight size={14} />
            </button>
          </div>

          {/* Kanban columns on Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pending Column */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
                  <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">New ({pendingColumn.length})</h3>
                </div>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
                {pendingColumn.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
                    <ShoppingBag size={24} className="stroke-[1.5] mb-2 opacity-40" />
                    <p className="text-[11px]">No new orders</p>
                  </div>
                ) : (
                  pendingColumn.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusChange={handleStatusChange} 
                      onViewDetails={setSelectedOrderForModal}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Preparing Column */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-md shadow-blue-400/50" />
                  <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Cooking ({preparingColumn.length})</h3>
                </div>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
                {preparingColumn.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
                    <Utensils size={24} className="stroke-[1.5] mb-2 opacity-40" />
                    <p className="text-[11px]">Nothing in cooking</p>
                  </div>
                ) : (
                  preparingColumn.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusChange={handleStatusChange} 
                      onViewDetails={setSelectedOrderForModal}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Ready Column */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
                  <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Ready ({readyColumn.length})</h3>
                </div>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
                {readyColumn.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
                    <CheckCircle size={24} className="stroke-[1.5] mb-2 opacity-40" />
                    <p className="text-[11px]">Ready list empty</p>
                  </div>
                ) : (
                  readyColumn.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusChange={handleStatusChange} 
                      onViewDetails={setSelectedOrderForModal}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight">Pipeline Control</h2>
          <p className="text-xs text-slate-400">Complete kitchen workflow pipeline</p>
        </div>
        <div className="flex bg-slate-900/60 border border-slate-800 p-1 rounded-xl self-start">
          <button 
            onClick={() => setActiveTab('active')}
            className={cn(
              "px-5 py-2 text-xs font-bold rounded-lg transition-all",
              activeTab === 'active' ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white"
            )}
          >
            Active Pipeline ({activeOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={cn(
              "px-5 py-2 text-xs font-bold rounded-lg transition-all",
              activeTab === 'completed' ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white"
            )}
          >
            History Log ({completedOrders.length})
          </button>
        </div>
      </div>

      {activeTab === 'active' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/30" />
                <h3 className="font-bold text-xs text-slate-200 tracking-wider uppercase">New Orders ({pendingColumn.length})</h3>
              </div>
            </div>
            <div className="space-y-4 flex-grow overflow-y-auto max-h-[600px]">
              {pendingColumn.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <ShoppingBag size={32} className="stroke-[1.5] mb-2 opacity-35" />
                  <p className="text-xs">No pending orders</p>
                </div>
              ) : (
                pendingColumn.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusChange={handleStatusChange} 
                    onViewDetails={setSelectedOrderForModal}
                  />
                ))
              )}
            </div>
          </div>

          {/* Preparing Column */}
          <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-md shadow-blue-400/30" />
                <h3 className="font-bold text-xs text-slate-200 tracking-wider uppercase">Preparing ({preparingColumn.length})</h3>
              </div>
            </div>
            <div className="space-y-4 flex-grow overflow-y-auto max-h-[600px]">
              {preparingColumn.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <Utensils size={32} className="stroke-[1.5] mb-2 opacity-35" />
                  <p className="text-xs">Kitchen is idle</p>
                </div>
              ) : (
                preparingColumn.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusChange={handleStatusChange} 
                    onViewDetails={setSelectedOrderForModal}
                  />
                ))
              )}
            </div>
          </div>

          {/* Ready Column */}
          <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/30" />
                <h3 className="font-bold text-xs text-slate-200 tracking-wider uppercase">Ready / Done ({readyColumn.length})</h3>
              </div>
            </div>
            <div className="space-y-4 flex-grow overflow-y-auto max-h-[600px]">
              {readyColumn.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <CheckCircle size={32} className="stroke-[1.5] mb-2 opacity-35" />
                  <p className="text-xs">No items ready for pickup</p>
                </div>
              ) : (
                readyColumn.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusChange={handleStatusChange} 
                    onViewDetails={setSelectedOrderForModal}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedOrders.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-3xl">
              <ShoppingBag size={40} className="mx-auto stroke-[1.5] mb-3 opacity-30" />
              <h3 className="font-bold text-sm text-slate-300">No completed orders yet</h3>
            </div>
          ) : (
            completedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange} 
                onViewDetails={setSelectedOrderForModal}
              />
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderMenuItems = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight">Dish Catalog</h2>
          <p className="text-xs text-slate-400">Your dishes listed on the platform</p>
        </div>
        <button 
          onClick={() => { setNewItemImageUrl(''); setIsAddItemModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-xs hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Add Dish
        </button>
      </div>

      {menuLoading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading your dishes...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="py-24 text-center text-slate-500 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <Utensils size={36} className="mx-auto stroke-[1.5] mb-3 opacity-30" />
          <h3 className="font-bold text-sm text-slate-300 mb-1">No dishes yet</h3>
          <p className="text-xs">Add your first dish to start receiving orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:border-slate-700/80 transition-all flex flex-col group">
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils size={36} className="text-slate-700" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/90 text-orange-400 text-[10px] font-bold tracking-wider rounded-lg border border-slate-850 uppercase">
                  {item.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-bold text-base text-white tracking-tight leading-tight line-clamp-1">{item.name}</h4>
                    <span className="font-mono text-orange-400 font-bold text-sm whitespace-nowrap">Rs.{item.price.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic mb-4">{item.description || 'No description'}</p>
                </div>
                <div className="pt-3 border-t border-slate-850 flex items-center justify-end">
                  <button 
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all"
                    title="Delete dish"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-lg">
        <h3 className="text-lg font-display font-bold text-white tracking-tight mb-5 pb-3 border-b border-slate-800">Account Credentials</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input name="name" type="text" defaultValue={profile.name} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input type="email" defaultValue={profile.email} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-200" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kitchen Address</label>
            <input name="location" type="text" defaultValue={profile.location} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Avatar</label>
            <ImageUploader
              value={avatarUrl}
              onChange={setAvatarUrl}
              token={localStorage.getItem("token")}
              variant="dark"
              label="Profile avatar"
            />
            <input type="hidden" name="avatar" value={avatarUrl} />
          </div>
          
          <input type="hidden" name="specialty" value={profile.specialty} />
          <input type="hidden" name="bio" value={profile.bio} />

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95">Save Profile Details</button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-lg">
        <h3 className="text-lg font-display font-bold text-white tracking-tight mb-5 pb-3 border-b border-slate-800">Security & Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-white">SMS Notification Dispatcher</p>
              <p className="text-[11px] text-slate-500">Dispatch messages automatically to customers on state shift</p>
            </div>
            <button className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold">Enabled</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-white">Audio Dispatch Alerts</p>
              <p className="text-[11px] text-slate-500">Sound audible bells when simulated incoming orders trigger</p>
            </div>
            <button className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-xl text-xs font-bold">Muted</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {!isEditingProfile ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 pb-6 border-b border-slate-800">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-28 h-28 rounded-full border-4 border-slate-800 object-cover shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div className="text-center md:text-left flex-1 space-y-2">
                <h2 className="text-2xl font-display font-bold text-white tracking-tight">{profile.name}</h2>
                <p className="text-sm font-semibold text-orange-400">{profile.specialty}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-850 rounded-full text-[11px] text-slate-400 font-semibold">
                    <MapPin size={12} className="text-orange-500" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-850 rounded-full text-[11px] text-slate-400 font-semibold">
                    <CheckCircle size={12} className="text-emerald-500" />
                    {completedOrders.filter(o => o.status === 'delivered').length} Delivered
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="px-5 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Modify bio
              </button>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Kitchen bio</h3>
              <p className="text-slate-300 leading-relaxed text-sm italic font-medium">
                "{profile.bio}"
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white mb-6">Modify Specialty & bio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kitchen Specialty</label>
                <input name="specialty" type="text" defaultValue={profile.specialty} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Location</label>
                <input name="location" type="text" defaultValue={profile.location} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-200" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio description</label>
              <textarea name="bio" rows={4} defaultValue={profile.bio} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Avatar</label>
              <ImageUploader
                value={avatarUrl}
                onChange={setAvatarUrl}
                token={localStorage.getItem("token")}
                variant="dark"
                label="Profile avatar"
              />
              <input type="hidden" name="avatar" value={avatarUrl} />
            </div>
            
            <input type="hidden" name="name" value={profile.name} />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-850"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="chef-dashboard flex min-h-screen relative overflow-hidden bg-slate-950">
      <Sidebar 
        activeTab={currentView} 
        onTabChange={setCurrentView} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
      />
      
      <main className={cn(
        "flex-1 p-6 md:p-8 overflow-y-auto transition-all duration-300 lg:pl-8 lg:pr-8",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <NewOrderToast 
          isVisible={showToast} 
          onClose={() => setShowToast(false)} 
          orderId={newOrderId} 
        />

        {/* Dynamic Modal detailed view */}
        <AnimatePresence>
          {selectedOrderForModal && (
            <OrderDetailsModal 
              order={selectedOrderForModal}
              onClose={() => setSelectedOrderForModal(null)}
              onStatusChange={handleStatusChange}
            />
          )}
        </AnimatePresence>

        {/* Add Food Item Modal */}
        <AnimatePresence>
          {isAddItemModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddItemModalOpen(false)}
                className="absolute inset-0 bg-slate-955/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10"
              >
                <div className="p-6 pb-3 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Add New Dish</h3>
                  <button onClick={() => setIsAddItemModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddNewItem} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dish Name</label>
                    <input name="name" type="text" required placeholder="e.g. Jaffna Crab Curry" className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none text-xs text-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (LKR)</label>
                      <input name="price" type="number" required placeholder="1400" className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none text-xs text-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select name="category" required className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none text-xs text-slate-200">
                      <option value="">— Select a category —</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dish image</label>
                    <ImageUploader
                      value={newItemImageUrl}
                      onChange={setNewItemImageUrl}
                      token={localStorage.getItem("token")}
                      variant="dark"
                      label="Dish image"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short description</label>
                    <textarea name="description" rows={3} placeholder="Describe ingredients, spice levels..." className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none text-xs text-slate-200" />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsAddItemModalOpen(false)} className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-xs font-bold">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold">
                      Add to Menu
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all"
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                {currentView}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {currentView === 'Dashboard' ? `Welcome back to the kitchen, ${profile.name.split(' ')[0]}!` : `Manage your ${currentView.toLowerCase()} catalog.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search catalog, order numbers..." 
                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-200 w-60"
              />
            </div>
            <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-slate-950"></span>
            </button>
          </div>
        </header>

        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {currentView === 'Dashboard' && renderDashboard()}
          {currentView === 'Orders' && renderOrders()}
          {currentView === 'Menu Items' && renderMenuItems()}
          {currentView === 'Profile' && renderProfile()}
          {currentView === 'Settings' && renderSettings()}
        </motion.div>
      </main>
    </div>
  );
}
