import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { OrderCard } from './components/OrderCard';
import { EarningsChart } from './components/EarningsChart';
import { NewOrderToast } from './components/NewOrderToast';
import { mockOrders, mockStats, mockChefProfile } from './mockData';
import { Order } from './types';
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
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { a } from 'motion/react-client';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [profile, setProfile] = useState(mockChefProfile);
  const [showToast, setShowToast] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    setCurrentView('Dashboard');
    window.location.href = 'http://localhost:5173/';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/chef/${profile.id}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        
        // Transform backend orders to match chef dashboard Order type
        const transformedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          customerName: o.customerName || "Customer",
          items: [{ name: o.foodItemName || "Ordered Item", quantity: o.quantity, price: o.totalPrice / o.quantity }],
          total: Number(o.totalPrice),
          status: o.status.toLowerCase(),
          createdAt: o.createdAt,
          deliveryTime: o.deliveryTime || "ASAP"
        }));

        setOrders(transformedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (isLoggedIn) {
      fetchOrders();
      // Poll for new orders every 30 seconds
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, profile.id]);

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
      const response = await fetch(`http://localhost:8000/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status.charAt(0).toUpperCase() + status.slice(1) }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status } : order
      ));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status");
    }
  };

  const simulateNewOrder = () => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id,
      customerName: "New Customer",
      items: [{ name: "Special Mixed Grill", quantity: 1, price: 1250.00 }],
      total: 1250.00,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryTime: "ASAP"
    };
    setOrders(prev => [newOrder, ...prev]);
    setNewOrderId(id);
    setShowToast(true);
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  // Calculate dynamic stats
  // Orders that were pending but are now preparing, ready, or delivered
  // PLUS any new orders that are preparing, ready, or delivered
  const newlyAcceptedOrders = orders.filter(o => {
    const initialOrder = mockOrders.find(mo => mo.id === o.id);
    if (initialOrder) {
      return initialOrder.status === 'pending' && o.status !== 'pending';
    }
    return o.status !== 'pending';
  });

  // Orders that are delivered now but weren't initially delivered
  const newlyFinishedOrders = orders.filter(o => {
    const initialOrder = mockOrders.find(mo => mo.id === o.id);
    if (initialOrder) {
      return initialOrder.status !== 'delivered' && o.status === 'delivered';
    }
    return o.status === 'delivered';
  });

  const sessionEarnings = newlyFinishedOrders.reduce((sum, o) => sum + o.total, 0);
  const sessionAcceptedCount = newlyAcceptedOrders.length;
  
  const displayTotalEarnings = mockStats.totalEarnings + sessionEarnings;
  const displayTotalOrders = mockStats.totalOrders + sessionAcceptedCount;

  const renderDashboard = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          label="Total Earnings" 
          value={`Rs. ${displayTotalEarnings.toLocaleString()}`} 
          icon={DollarSign} 
          trend={{ value: 12, isPositive: true }}
          color="emerald"
        />
        <StatsCard 
          label="Total Orders" 
          value={displayTotalOrders} 
          icon={ShoppingBag} 
          trend={{ value: 8, isPositive: true }}
          color="orange"
        />
        <StatsCard 
          label="Avg. Rating" 
          value={mockStats.averageRating} 
          icon={Star} 
          color="amber"
        />
        <StatsCard 
          label="Active Orders" 
          value={activeOrders.length} 
          icon={Clock} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Earnings Chart */}
          <section className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold text-slate-900">Earnings Overview</h2>
              <select className="text-sm font-medium text-slate-500 bg-slate-50 border-none rounded-lg px-2 py-1 focus:ring-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <EarningsChart data={mockStats.earningsHistory} />
          </section>

          {/* Orders Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <h2 className="text-lg font-display font-bold text-slate-900">Recent Orders</h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Active ({activeOrders.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'completed' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Completed
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setCurrentView('Orders')}
                className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {(activeTab === 'active' ? activeOrders : completedOrders).slice(0, 4).map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusChange={handleStatusChange} 
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Chef Profile Card */}
          <section className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-orange-50 object-cover mx-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white">
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-1">{profile.name}</h3>
            <p className="text-sm font-medium text-orange-600 mb-4">{profile.specialty}</p>
            
            <div className="flex items-center justify-center gap-1 text-slate-500 text-sm mb-6">
              <MapPin size={14} />
              <span>{profile.location}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
              "{profile.bio}"
            </p>

            <button 
              onClick={() => setCurrentView('Profile')}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
            >
              View Profile
            </button>
          </section>

          {/* Quick Actions / Tips */}
          <section className="p-6 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-display font-bold mb-2">Chef's Tip</h3>
              <p className="text-sm text-orange-50 leading-relaxed mb-4">
                Updating your menu with seasonal ingredients can increase your orders by up to 25%!
              </p>
              <button 
                onClick={() => setCurrentView('Menu Items')}
                className="px-4 py-2 bg-white text-orange-600 rounded-lg font-bold text-xs hover:bg-orange-50 transition-all"
              >
                Update Menu
              </button>
            </div>
            <Utensils className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 rotate-12" />
          </section>
        </div>
      </div>
    </>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-slate-900">Order Management</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Active ({activeOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'completed' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            History
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {(activeTab === 'active' ? activeOrders : completedOrders).map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onStatusChange={handleStatusChange} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderMenuItems = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-slate-900">Menu Items</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
          <Plus size={18} />
          Add New Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Chicken Enchiladas', price: 18.50, category: 'Main Course', image: 'https://picsum.photos/seed/enchiladas/400/300' },
          { name: 'Beef Tacos', price: 16.00, category: 'Main Course', image: 'https://picsum.photos/seed/tacos/400/300' },
          { name: 'Guacamole & Chips', price: 8.50, category: 'Appetizer', image: 'https://picsum.photos/seed/guac/400/300' },
          { name: 'Horchata', price: 4.50, category: 'Beverage', image: 'https://picsum.photos/seed/horchata/400/300' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>
                <span className="font-bold text-orange-600">Rs. {item.price.toLocaleString()}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">Edit</button>
                <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Account Settings</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <input name="name" type="text" defaultValue={profile.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input type="email" defaultValue="ranjan@chefdash.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Kitchen Location</label>
            <input name="location" type="text" defaultValue={profile.location} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Avatar URL</label>
            <input name="avatar" type="text" defaultValue={profile.avatar} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
          </div>
          
          {/* Hidden fields to maintain other profile data when updating from settings */}
          <input type="hidden" name="specialty" value={profile.specialty} />
          <input type="hidden" name="bio" value={profile.bio} />

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button type="button" className="px-6 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">Save Changes</button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Security</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl text-slate-600 group-hover:text-orange-600 transition-colors">
                <Settings size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Change Password</p>
                <p className="text-xs text-slate-500">Update your account password</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl text-slate-600 group-hover:text-orange-600 transition-colors">
                <Bell size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Notification Preferences</p>
                <p className="text-xs text-slate-500">Manage how you receive alerts</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        {!isEditingProfile ? (
          <>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-orange-50 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{profile.name}</h2>
                <p className="text-lg font-medium text-orange-600 mb-4">{profile.specialty}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-sm text-slate-600">
                    <MapPin size={16} className="text-orange-500" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-sm text-slate-600">
                    <Star size={16} className="text-amber-500" fill="currentColor" />
                    {mockStats.averageRating} Rating
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-sm text-slate-600">
                    <ShoppingBag size={16} className="text-blue-500" />
                    {mockStats.totalOrders} Orders
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
              >
                Edit Profile
              </button>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-slate-900">About Me</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {profile.bio}
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">Edit Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input name="name" type="text" defaultValue={profile.name} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Specialty</label>
                <input name="specialty" type="text" defaultValue={profile.specialty} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Location</label>
                <input name="location" type="text" defaultValue={profile.location} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Avatar URL</label>
                <input name="avatar" type="text" defaultValue={profile.avatar} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Bio</label>
              <textarea name="bio" rows={4} defaultValue={profile.bio} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"></textarea>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button 
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-6 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 mx-auto mb-4">
              <Utensils size={32} />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">ChefDash</h2>
            <p className="text-slate-500 font-medium">Welcome back, Chef!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="chef@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <input 
                type="password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <button className="text-orange-600 font-bold hover:underline">Join the kitchen</button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative overflow-hidden">
      <Sidebar 
        activeTab={currentView} 
        onTabChange={setCurrentView} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className={cn(
        "flex-1 p-8 overflow-y-auto transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <NewOrderToast 
          isVisible={showToast} 
          onClose={() => setShowToast(false)} 
          orderId={newOrderId} 
        />

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-orange-500 hover:border-orange-200 transition-all"
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                {currentView}
              </h1>
              <p className="text-slate-500 font-medium">
                {currentView === 'Dashboard' ? `Welcome back, ${profile.name.split(' ')[0]}!` : `Manage your ${currentView.toLowerCase()} here.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all w-64"
              />
            </div>
            {currentView === 'Dashboard' && (
              <button 
                onClick={simulateNewOrder}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
              >
                <Plus size={18} />
                Simulate Order
              </button>
            )}
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-orange-500 hover:border-orange-200 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
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

