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
import { subDays, format, formatDistanceToNow } from 'date-fns';
import {
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Clock,
  Search,
  Bell,
  Plus,
  MapPin,
  ChevronRight,
  Utensils,
  Menu,
  AlertTriangle,
  X,
  ChefHat,
  Sparkles,
  ArrowRight,
  Trash2,
  Package,
  AlertCircle,
  LucideIcon,
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

const statusDot: Record<Order['status'], string> = {
  pending: 'bg-amber-500',
  preparing: 'bg-blue-500',
  ready: 'bg-emerald-500',
  delivered: 'bg-stone-400',
  cancelled: 'bg-rose-500',
};

const timeAgo = (iso?: string) => {
  if (!iso) return 'just now';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'just now';
  return formatDistanceToNow(d, { addSuffix: true });
};

interface PipelineColumnProps {
  title: string;
  count: number;
  dotClass: string;
  icon: LucideIcon;
  emptyIcon: LucideIcon;
  emptyText: string;
  orders: Order[];
  moreCount?: number;
  onShowAll?: () => void;
  onStatusChange: (id: string, status: Order['status']) => void;
  onViewDetails?: (order: Order) => void;
}

const PipelineColumn = ({
  title, count, dotClass, icon: Icon, emptyIcon: EmptyIcon, emptyText,
  orders, moreCount = 0, onShowAll, onStatusChange, onViewDetails,
}: PipelineColumnProps) => (
  <div className="chef-panel rounded-2xl p-4 flex flex-col min-h-[280px]">
    <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-stone-900/10">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotClass} shadow-md`} />
        <h3 className="font-bold text-xs text-stone-700 uppercase tracking-wider">{title}</h3>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-200/70 text-stone-600 tabular-nums">{count}</span>
      </div>
      <Icon size={14} className="text-stone-400" />
    </div>

    <div className="space-y-3 flex-1">
      {orders.length === 0 ? (
        <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center text-stone-400">
          <EmptyIcon size={24} className="stroke-[1.5] mb-2 opacity-50" />
          <p className="text-[11px] font-medium">{emptyText}</p>
        </div>
      ) : (
        orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
            onViewDetails={onViewDetails}
          />
        ))
      )}
    </div>

    {moreCount > 0 && onShowAll && (
      <button
        onClick={onShowAll}
        className="mt-3 w-full py-2 rounded-xl border border-stone-900/10 bg-white/70 text-[11px] font-bold text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/25 transition-all flex items-center justify-center gap-1.5"
      >
        View {moreCount} more <ArrowRight size={11} />
      </button>
    )}
  </div>
);

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

  // Chefs must be approved by an admin before using the app. The backend
  // blocks their login while pending, but this also covers users who logged
  // in before approval or whose status changed after login (stale JWTs).
  const approvalStatus = (() => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      return userObj.approval_status;
    } catch {
      return undefined;
    }
  })();
  const isApproved =
    !approvalStatus || approvalStatus === "Approved";

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

  // UI interaction states
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

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

  const deliveredCount = completedOrders.filter(o => o.status === 'delivered').length;
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

  // Real, computed trends for the stat cards (today vs yesterday)
  const todayPrefix = format(new Date(), 'yyyy-MM-dd');
  const yesterdayPrefix = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const pctChange = (cur: number, prev: number) =>
    prev > 0 ? Math.round(((cur - prev) / prev) * 100) : (cur > 0 ? 100 : 0);

  const earnedToday = completedOrders
    .filter(o => o.status === 'delivered' && o.createdAt?.startsWith(todayPrefix))
    .reduce((s, o) => s + o.total, 0);
  const earnedYesterday = completedOrders
    .filter(o => o.status === 'delivered' && o.createdAt?.startsWith(yesterdayPrefix))
    .reduce((s, o) => s + o.total, 0);
  const ordersToday = completedOrders.filter(o => o.status === 'delivered' && o.createdAt?.startsWith(todayPrefix)).length;
  const ordersYesterday = completedOrders.filter(o => o.status === 'delivered' && o.createdAt?.startsWith(yesterdayPrefix)).length;
  const earningsTrend = pctChange(earnedToday, earnedYesterday);
  const ordersTrend = pctChange(ordersToday, ordersYesterday);

  const trendOf = (value: number) =>
    value !== 0 ? { value: Math.abs(value), isPositive: value > 0 } : undefined;

  // Search — filters orders and menu items across every view
  const q = searchQuery.trim().toLowerCase();
  const matchesOrder = (o: Order) =>
    !q ||
    o.id.toLowerCase().includes(q) ||
    o.customerName.toLowerCase().includes(q) ||
    o.items.some(i => i.name.toLowerCase().includes(q)) ||
    (o.description ?? '').toLowerCase().includes(q);
  const matchesItem = (item: CustomFoodItem) =>
    !q ||
    item.name.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q);

  const filteredPending = pendingColumn.filter(matchesOrder);
  const filteredPreparing = preparingColumn.filter(matchesOrder);
  const filteredReady = readyColumn.filter(matchesOrder);
  const filteredCompleted = completedOrders.filter(matchesOrder);
  const filteredMenuItems = menuItems.filter(matchesItem);

  const recentOrders = [...orders]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 5);

  const viewSubtitles: Record<string, string> = {
    Dashboard: `Welcome back to the kitchen, ${profile.name.split(' ')[0] || 'Chef'} — here's what's happening today`,
    Orders: 'Manage the complete kitchen workflow pipeline',
    'Menu Items': 'Curate the dishes you offer on the platform',
    Profile: 'Your public chef identity and kitchen story',
    Settings: 'Account credentials, security and alert preferences',
  };

  const firstName = profile.name.split(' ')[0] || 'Chef';

  const NoSearchResults = ({ onClear }: { onClear: () => void }) => (
    <div className="col-span-full py-20 text-center bg-white/60 border border-stone-900/10 rounded-3xl">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-stone-900/10 flex items-center justify-center mb-4">
        <Search size={22} className="text-stone-400" />
      </div>
      <h3 className="font-display font-bold text-base text-stone-800 mb-1">No results for "{searchQuery}"</h3>
      <p className="text-xs text-stone-500 mb-5">Try a different dish, order number or customer name.</p>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-white border border-stone-300 text-stone-600 hover:text-brand-primary hover:border-brand-primary/50 rounded-full text-xs font-bold transition-all"
      >
        Clear search
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden chef-card rounded-3xl p-6 md:p-8">
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-brand-primary/15 rounded-full blur-3xl chef-float-slow" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 chef-chip bg-brand-primary/10 text-brand-primary border-brand-primary/30">
              <Sparkles size={11} /> Today's Kitchen
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-display font-bold text-stone-900 tracking-tight">
              Good to see you, {firstName} <ChefHat size={26} className="inline text-brand-primary -mt-1" />
            </h2>
            <p className="mt-1.5 text-sm text-stone-500">
              You have <span className="font-bold text-brand-primary">{pendingColumn.length}</span> new order{pendingColumn.length === 1 ? '' : 's'} awaiting confirmation ·{' '}
              <span className="font-bold text-stone-900">{activeOrders.length}</span> active in the pipeline
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('Orders')}
              className="px-5 py-2.5 bg-white border border-stone-300 text-stone-700 hover:text-brand-primary hover:border-brand-primary/50 rounded-full text-xs font-bold transition-all"
            >
              Open Pipeline
            </button>
            <button
              onClick={() => { setNewItemImageUrl(''); setIsAddItemModalOpen(true); }}
              className="px-5 py-2.5 bg-brand-primary text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-brand-primary/30 hover:bg-brand-primary/90 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={15} /> Add Dish
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          label="Total Earnings"
          value={totalEarnings}
          prefix="Rs. "
          icon={DollarSign}
          color="emerald"
          trend={trendOf(earningsTrend)}
        />
        <StatsCard
          label="Total Orders"
          value={totalOrdersCount}
          icon={ShoppingBag}
          color="orange"
          trend={trendOf(ordersTrend)}
        />
        <StatsCard
          label="Completed Orders"
          value={deliveredCount}
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

      {/* Earnings + Pipeline */}
      <div className="space-y-8">
        <section className="p-6 chef-card rounded-3xl relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-display font-bold text-stone-900 tracking-tight">Earnings Over Time</h2>
              <p className="text-xs text-stone-500 mt-0.5">Track your daily income — last 7 days</p>
            </div>
            <span className="inline-flex items-center gap-1.5 chef-chip bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <EarningsChart data={earningsHistory} />
        </section>

        {/* Mini Kanban Row */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-display font-bold text-stone-900 tracking-tight">Interactive Pipeline</h2>
              <p className="text-xs text-stone-500 mt-0.5">Advance orders by clicking their action button</p>
            </div>
            <button
              onClick={() => setCurrentView('Orders')}
              className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1.5 px-3 py-2 bg-brand-primary/10 rounded-full transition-all border border-brand-primary/25"
            >
              Expand View <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PipelineColumn
              title="New Orders"
              count={pendingColumn.length}
              dotClass="bg-amber-500 shadow-amber-500/50"
              icon={AlertCircle}
              emptyIcon={ShoppingBag}
              emptyText="No new orders"
              orders={filteredPending.slice(0, 3)}
              moreCount={Math.max(0, filteredPending.length - 3)}
              onShowAll={() => setCurrentView('Orders')}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrderForModal}
            />
            <PipelineColumn
              title="Cooking"
              count={preparingColumn.length}
              dotClass="bg-blue-500 shadow-blue-500/50"
              icon={ChefHat}
              emptyIcon={Utensils}
              emptyText="Nothing on the stove"
              orders={filteredPreparing.slice(0, 3)}
              moreCount={Math.max(0, filteredPreparing.length - 3)}
              onShowAll={() => setCurrentView('Orders')}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrderForModal}
            />
            <PipelineColumn
              title="Ready"
              count={readyColumn.length}
              dotClass="bg-emerald-500 shadow-emerald-500/50"
              icon={Package}
              emptyIcon={CheckCircle}
              emptyText="Ready list is empty"
              orders={filteredReady.slice(0, 3)}
              moreCount={Math.max(0, filteredReady.length - 3)}
              onShowAll={() => setCurrentView('Orders')}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrderForModal}
            />
          </div>
        </section>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-stone-900 tracking-tight">Pipeline Control</h2>
          <p className="text-xs text-stone-500 mt-0.5">Complete kitchen workflow pipeline</p>
        </div>
        <div className="flex bg-white border border-stone-900/10 p-1 rounded-full self-start backdrop-blur">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              "px-5 py-2 text-xs font-bold rounded-full transition-all",
              activeTab === 'active'
                ? "bg-gradient-to-r from-brand-primary to-amber-500 text-white shadow-md shadow-brand-primary/25"
                : "text-stone-500 hover:text-stone-900"
            )}
          >
            Active Pipeline ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={cn(
              "px-5 py-2 text-xs font-bold rounded-full transition-all",
              activeTab === 'completed'
                ? "bg-gradient-to-r from-brand-primary to-amber-500 text-white shadow-md shadow-brand-primary/25"
                : "text-stone-500 hover:text-stone-900"
            )}
          >
            History Log ({completedOrders.length})
          </button>
        </div>
      </div>

      {activeTab === 'active' ? (
        searchQuery && filteredPending.length + filteredPreparing.length + filteredReady.length === 0 ? (
          <NoSearchResults onClear={() => setSearchQuery('')} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PipelineColumn
              title="New Orders"
              count={pendingColumn.length}
              dotClass="bg-amber-500 shadow-amber-500/50"
              icon={AlertCircle}
              emptyIcon={ShoppingBag}
              emptyText="No pending orders"
              orders={filteredPending}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrderForModal}
            />
            <PipelineColumn
              title="Preparing"
              count={preparingColumn.length}
              dotClass="bg-blue-500 shadow-blue-500/50"
              icon={ChefHat}
              emptyIcon={Utensils}
              emptyText="Kitchen is idle"
              orders={filteredPreparing}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrderForModal}
            />
            <PipelineColumn
              title="Ready / Done"
              count={readyColumn.length}
              dotClass="bg-emerald-500 shadow-emerald-500/50"
              icon={Package}
              emptyIcon={CheckCircle}
              emptyText="No items ready for pickup"
              orders={filteredReady}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrderForModal}
            />
          </div>
        )
      ) : searchQuery && filteredCompleted.length === 0 ? (
        <NoSearchResults onClear={() => setSearchQuery('')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompleted.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/60 border border-stone-900/10 rounded-3xl">
              <ShoppingBag size={40} className="mx-auto stroke-[1.5] mb-3 opacity-30 text-stone-300" />
              <h3 className="font-display font-bold text-sm text-stone-700">No completed orders yet</h3>
              <p className="text-xs text-stone-500 mt-1">Delivered and cancelled orders will appear here</p>
            </div>
          ) : (
            filteredCompleted.map(order => (
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-stone-900 tracking-tight">Dish Catalog</h2>
          <p className="text-xs text-stone-500 mt-0.5">Your dishes listed on the platform</p>
        </div>
        <button
          onClick={() => { setNewItemImageUrl(''); setIsAddItemModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-full font-bold text-xs hover:shadow-lg hover:shadow-brand-primary/30 hover:bg-brand-primary/90 active:scale-95 transition-all shrink-0"
        >
          <Plus size={16} />
          Add Dish
        </button>
      </div>

      {menuLoading ? (
        <div className="py-24 text-center text-stone-500">
          <div className="w-9 h-9 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-medium">Loading your dishes...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="py-24 text-center bg-white/60 border border-stone-900/10 rounded-3xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center mb-4">
            <Utensils size={24} className="text-brand-primary" />
          </div>
          <h3 className="font-display font-bold text-sm text-stone-700 mb-1">No dishes yet</h3>
          <p className="text-xs text-stone-500 mb-5">Add your first dish to start receiving orders</p>
          <button
            onClick={() => { setNewItemImageUrl(''); setIsAddItemModalOpen(true); }}
            className="px-5 py-2.5 bg-brand-primary text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all"
          >
            Add your first dish
          </button>
        </div>
      ) : filteredMenuItems.length === 0 && searchQuery ? (
        <NoSearchResults onClear={() => setSearchQuery('')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="chef-card rounded-3xl overflow-hidden flex flex-col group">
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                    <Utensils size={36} className="text-stone-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

                <span className="absolute top-3 left-3 chef-chip bg-white/90 text-brand-primary border-stone-900/10 backdrop-blur">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur border border-stone-900/10 rounded-xl text-brand-primary font-mono font-bold text-sm shadow-lg tabular-nums">
                  Rs.{item.price.toLocaleString()}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h4 className="font-display font-bold text-base text-stone-900 tracking-tight leading-tight line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mt-1.5">{item.description || 'No description yet'}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-900/10 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    Listed on menu
                  </span>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="p-2 bg-rose-500/10 border border-rose-500/25 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all"
                    title="Remove dish from menu"
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="chef-card rounded-3xl p-8">
        <h3 className="text-lg font-display font-bold text-stone-900 tracking-tight mb-5 pb-3 border-b border-stone-900/10">Account Credentials</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Full Name</label>
              <input name="name" type="text" defaultValue={profile.name} className="chef-input" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Email Address</label>
              <input type="email" defaultValue={profile.email} className="chef-input" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Kitchen Address</label>
            <input name="location" type="text" defaultValue={profile.location} className="chef-input" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Profile Avatar</label>
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

          <div className="pt-5 border-t border-stone-900/10 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-brand-primary text-white rounded-full font-bold text-xs hover:shadow-lg hover:shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all active:scale-95">
              Save Profile Details
            </button>
          </div>
        </form>
      </div>

      <div className="chef-card rounded-3xl p-8">
        <h3 className="text-lg font-display font-bold text-stone-900 tracking-tight mb-5 pb-3 border-b border-stone-900/10">Security & Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-stone-50/80 border border-stone-900/10 rounded-2xl">
            <div className="pr-4">
              <p className="text-sm font-bold text-stone-900">SMS Notification Dispatcher</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Dispatch messages automatically to customers on status change</p>
            </div>
            <button
              onClick={() => setSmsEnabled(v => !v)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors shrink-0",
                smsEnabled ? "bg-brand-primary" : "bg-stone-300"
              )}
              aria-label="Toggle SMS dispatcher"
            >
              <span className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                smsEnabled && "translate-x-5"
              )} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-stone-50/80 border border-stone-900/10 rounded-2xl">
            <div className="pr-4">
              <p className="text-sm font-bold text-stone-900">Audio Dispatch Alerts</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Play an audible bell when new orders come in</p>
            </div>
            <button
              onClick={() => setAudioEnabled(v => !v)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors shrink-0",
                audioEnabled ? "bg-brand-primary" : "bg-stone-300"
              )}
              aria-label="Toggle audio alerts"
            >
              <span className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                audioEnabled && "translate-x-5"
              )} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    const initials = profile.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase())
      .join('');

    return (
      <div className="max-w-3xl mx-auto">
        <div className="chef-card rounded-3xl p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />

          {!isEditingProfile ? (
            <div className="relative space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8 pb-6 border-b border-stone-900/10">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-28 h-28 rounded-full object-cover ring-2 ring-brand-primary/50 ring-offset-4 ring-offset-white shadow-xl shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-primary to-amber-500 flex items-center justify-center text-white font-display font-bold text-3xl ring-2 ring-brand-primary/50 ring-offset-4 ring-offset-white shadow-xl shrink-0">
                    {initials || 'C'}
                  </div>
                )}
                <div className="text-center md:text-left flex-1 space-y-2">
                  <h2 className="text-2xl font-display font-bold text-stone-900 tracking-tight">{profile.name || 'Chef'}</h2>
                  <p className="text-sm font-semibold text-brand-primary">{profile.specialty || 'Home Kitchen'}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 border border-stone-900/10 rounded-full text-[11px] text-stone-600 font-semibold">
                      <MapPin size={12} className="text-brand-primary" />
                      {profile.location || 'Location not set'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 border border-stone-900/10 rounded-full text-[11px] text-stone-600 font-semibold">
                      <CheckCircle size={12} className="text-emerald-600" />
                      {deliveredCount} Delivered
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-5 py-2.5 bg-white border border-stone-300 text-stone-700 hover:text-brand-primary hover:border-brand-primary/50 rounded-full text-xs font-bold transition-all shrink-0"
                >
                  Modify bio
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.16em]">Kitchen bio</h3>
                <p className="text-stone-600 leading-relaxed text-sm italic font-medium">
                  "{profile.bio || 'No bio yet — add one to tell customers about your kitchen.'}"
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="relative space-y-6">
              <h3 className="text-lg font-display font-bold text-stone-900 mb-6">Modify Specialty & bio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Kitchen Specialty</label>
                  <input name="specialty" type="text" defaultValue={profile.specialty} required className="chef-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Display Location</label>
                  <input name="location" type="text" defaultValue={profile.location} required className="chef-input" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Bio description</label>
                <textarea name="bio" rows={4} defaultValue={profile.bio} required className="chef-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Profile Avatar</label>
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

              <div className="flex justify-end gap-3 pt-5 border-t border-stone-900/10">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-full text-xs font-bold hover:bg-stone-50 hover:text-stone-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all active:scale-95"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  // Show a status screen instead of the dashboard while the account is not approved.
  if (!isApproved) {
    const isRejected = approvalStatus === "Rejected";
    return (
      <div className="chef-dashboard flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative w-full max-w-md chef-card rounded-3xl p-10 text-center shadow-2xl">
          <div
            className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center border ${
              isRejected
                ? "bg-rose-500/10 text-rose-600 border-rose-500/25"
                : "bg-amber-500/10 text-amber-600 border-amber-500/25"
            }`}
          >
            {isRejected ? <AlertTriangle size={28} /> : <Clock size={28} />}
          </div>
          <h1 className="text-xl font-display font-bold text-stone-900 tracking-tight mb-3">
            {isRejected ? "Application Rejected" : "Awaiting Approval"}
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed mb-8">
            {isRejected
              ? "Your chef application was rejected by an admin. Please contact support for more information."
              : "Your chef account is pending admin approval. You'll be able to use the kitchen dashboard as soon as an admin approves your application."}
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-3 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-full text-sm font-bold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-dashboard flex min-h-screen relative overflow-hidden">
      <Sidebar
        activeTab={currentView}
        onTabChange={setCurrentView}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        deliveredCount={deliveredCount}
        activeCount={activeOrders.length}
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
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="relative w-full max-w-md chef-card rounded-3xl overflow-hidden shadow-2xl z-10"
              >
                <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-primary to-amber-500" />
                <div className="p-6 pb-3 border-b border-stone-900/10 flex items-center justify-between bg-white/60">
                  <div>
                    <h3 className="text-base font-display font-bold text-stone-900">Add New Dish</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">List a new dish on your menu</p>
                  </div>
                  <button onClick={() => setIsAddItemModalOpen(false)} className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddNewItem} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Dish Name</label>
                    <input name="name" type="text" required placeholder="e.g. Jaffna Crab Curry" className="chef-input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Price (LKR)</label>
                    <input name="price" type="number" required placeholder="1400" className="chef-input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Category</label>
                    <select name="category" required className="chef-input">
                      <option value="">— Select a category —</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Dish image</label>
                    <ImageUploader
                      value={newItemImageUrl}
                      onChange={setNewItemImageUrl}
                      token={localStorage.getItem("token")}
                      variant="dark"
                      label="Dish image"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">Short description</label>
                    <textarea name="description" rows={3} placeholder="Describe ingredients, spice levels..." className="chef-input" />
                  </div>
                  <div className="pt-4 flex justify-end gap-3 border-t border-stone-900/10">
                    <button type="button" onClick={() => setIsAddItemModalOpen(false)} className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-full text-xs font-bold hover:bg-stone-50 hover:text-stone-900 transition-all">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2.5 bg-brand-primary text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all active:scale-95">
                      Add to Menu
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Header */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 min-w-0">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-500 hover:text-brand-primary hover:border-brand-primary/40 transition-all"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-display font-bold text-stone-900 tracking-tight truncate">
                  {currentView}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 chef-chip bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">
                {viewSubtitles[currentView]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, dishes..."
                className="pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary text-stone-900 placeholder-stone-400 w-52 lg:w-64 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(v => !v)}
                className={cn(
                  "p-2.5 bg-white border rounded-full transition-all relative",
                  isNotifOpen
                    ? "text-brand-primary border-brand-primary/40"
                    : "text-stone-500 hover:text-brand-primary border-stone-200 hover:border-brand-primary/40"
                )}
              >
                <Bell size={18} />
                {pendingColumn.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-primary text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-brand-primary/40 border-2 border-white">
                    {pendingColumn.length > 9 ? '9+' : pendingColumn.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-12 z-50 w-80 chef-card rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="p-4 border-b border-stone-900/10 bg-white/70 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-display font-bold text-stone-900">Notifications</p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {pendingColumn.length > 0
                              ? `${pendingColumn.length} new order${pendingColumn.length === 1 ? '' : 's'} awaiting action`
                              : 'All caught up'}
                          </p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                      </div>

                      <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                        {recentOrders.length === 0 ? (
                          <div className="py-10 text-center text-stone-500">
                            <Bell size={20} className="mx-auto mb-2 opacity-40" />
                            <p className="text-xs">No activity yet</p>
                          </div>
                        ) : (
                          recentOrders.map(o => (
                            <button
                              key={o.id}
                              onClick={() => { setCurrentView('Orders'); setIsNotifOpen(false); }}
                              className="w-full text-left p-3 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-3 group"
                            >
                              <span className={`w-2 h-2 rounded-full ${statusDot[o.status]} shrink-0`} />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-stone-800 truncate font-mono">{o.id}</p>
                                <p className="text-[10px] text-stone-500 truncate mt-0.5">
                                  {o.customerName} · {o.items[0]?.name}
                                </p>
                              </div>
                              <span className="text-[9px] text-stone-400 shrink-0 group-hover:text-stone-500">
                                {timeAgo(o.createdAt)}
                              </span>
                            </button>
                          ))
                        )}
                      </div>

                      <div className="p-2 border-t border-stone-900/10">
                        <button
                          onClick={() => { setCurrentView('Orders'); setIsNotifOpen(false); }}
                          className="w-full py-2 rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition-colors"
                        >
                          View all orders
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <motion.div
          key={currentView + activeTab}
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
