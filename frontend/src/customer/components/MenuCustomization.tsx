import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Search,
  Utensils,
  Coffee,
  Leaf,
  IceCream,
  Soup,
  CheckSquare,
  ShoppingBag,
  Star,
  Clock,
} from "lucide-react";
import type { FoodCategory, FoodItem, Request } from "../types";
import { RequestForm } from "./RequestForm";
import { motion, AnimatePresence } from "motion/react";


export const MenuCustomization: React.FC = () => {
  // Local state for requests since we don't have AppContext in MVP branch yet
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(
    null,
  );
  const [menuCategories, setMenuCategories] = useState<FoodCategory[]>([]);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

  useEffect(() => {
    const loadMenu = async () => {
      setMenuLoading(true);
      setMenuError(null);

      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/food/categories`),
          fetch(`${API_BASE_URL}/food`),
        ]);

        if (!categoriesResponse.ok || !itemsResponse.ok) {
          throw new Error("Failed to load menu data");
        }

        const [categoriesData, itemsData] = await Promise.all([
          categoriesResponse.json(),
          itemsResponse.json(),
        ]);

        // Sort categories to ensure 'Other' is always the last option
        const sortedCategories = categoriesData.sort((a: any, b: any) => {
          if (a.name.toLowerCase() === 'other') return 1;
          if (b.name.toLowerCase() === 'other') return -1;
          return 0;
        });

        setMenuCategories(sortedCategories);
        setMenuItems(itemsData);
      } catch (error) {
        console.error(error);
        setMenuError("Unable to load menu items. Please try again soon.");
      } finally {
        setMenuLoading(false);
      }
    };

    void loadMenu();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      try {
        const response = await fetch(`${API_BASE_URL}/orders/customer/${user.uid}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        
        // Transform backend orders to frontend Request type
        const transformedOrders: Request[] = data.map((o: any) => ({
          id: o.id,
          title: o.foodItemName || "Ordered Item",
          date: o.deliveryDate ? o.deliveryDate.split('T')[0] : new Date(o.createdAt).toISOString().split('T')[0],
          guests: o.quantity || 1,
          budget: Number(o.totalPrice) || 0,
          status: o.status,
          bids: 0,
          location: "Colombo",
          dietary: [],
          description: `${o.mealDescription || ""} STATUS: ${o.status}`
        }));
        
        setRequests(transformedOrders);
      } catch (err) {
        console.error("Error fetching customer orders:", err);
      }
    };

    fetchCustomerOrders();
    const interval = setInterval(fetchCustomerOrders, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  type CategoryStyle = { icon: React.ComponentType<any>; gradient: string; accent: string };
  const categoryStyles: Record<string, CategoryStyle> = {
    "rice & curry": { icon: Soup,       gradient: "from-orange-400 to-red-500",    accent: "#ea580c" },
    "short eats":   { icon: CheckSquare, gradient: "from-yellow-400 to-orange-400", accent: "#d97706" },
    salads:         { icon: Leaf,        gradient: "from-green-400 to-emerald-600", accent: "#16a34a" },
    desserts:       { icon: IceCream,    gradient: "from-pink-400 to-rose-600",     accent: "#e11d48" },
    beverages:      { icon: Coffee,      gradient: "from-sky-400 to-blue-600",      accent: "#2563eb" },
    other:          { icon: Utensils,    gradient: "from-violet-400 to-purple-600", accent: "#7c3aed" },
  };

  const groupedMenuItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const grouped = new Map<string, FoodItem[]>();

    menuItems.forEach((item) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);

      if (!matchesSearch) return;

      const list = grouped.get(item.categoryId) ?? [];
      list.push(item);
      grouped.set(item.categoryId, list);
    });

    return grouped;
  }, [menuItems, searchQuery]);

  const selectedCategory = menuCategories.find(
    (category) => category.id === selectedCategoryId,
  );

  const handleCategoryClick = (categoryId: string) => {
    // Toggle: click same category again to close
    if (selectedCategoryId === categoryId && !selectedFoodItem) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
      setSelectedFoodItem(null);
    }
  };

  const handleFoodItemClick = (item: FoodItem) => {
    setSelectedFoodItem(item);
  };

  const handleFormCancel = () => {
    setSelectedFoodItem(null);
  };

  const handleFormSubmit = async (data: Partial<Request>) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login to place an order");
      return;
    }

    const user = JSON.parse(userStr);
    
    const orderPayload = {
      customerId: user.uid,
      chefId: selectedFoodItem?.chefId,
      foodItemId: selectedFoodItem?.id,
      quantity: data.guests || 1,
      totalPrice: data.budget || (selectedFoodItem?.price || 0) * (data.guests || 1),
      deliveryDate: data.date,
      deliveryTime: data.description?.match(/Time: (.*)/)?.[1]?.trim() || "ASAP",
      mealDescription: data.description || `Order for ${selectedFoodItem?.name}`,
      clientLatitude: data.clientLatitude,
      clientLongitude: data.clientLongitude,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      const newOrder = await response.json();
      
      const newRequest: Request = {
        id: newOrder.id,
        title: data.title || "New Request",
        date: data.date || new Date().toISOString().split("T")[0],
        guests: data.guests || 1,
        budget: data.budget || 0,
        status: "open",
        bids: 0,
        location: "Current Location",
        dietary: data.dietary || [],
        description: data.description || "",
      };
      setRequests((prev) => [newRequest, ...prev]);
      setSelectedCategoryId(null);
      setSelectedFoodItem(null);
    } catch (error: any) {
      console.error("Error placing order:", error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  const handleRequestClick = (req: Request) => {
    // Placeholder for future request details view
    console.log("Clicked request:", req);
  };

  return (
    <section
      id="menu"
      className="py-32 bg-brand-cream relative overflow-hidden text-stone-900 border-b border-stone-900/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Customize Your Experience
          </span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 tracking-tight mb-8">
            What do you feel like
            <br />
            <span className="text-brand-primary italic">eating today?</span>
          </h2>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-20">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-stone-500" />
            </div>
            <input
              type="text"
              placeholder="Search for specific food items (e.g. String Hoppers, Lamprais)..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white rounded-[32px] border border-stone-900/5 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/50 text-lg shadow-xl shadow-stone-900/5 transition-all"
            />
          </div>

          {/* Quick Cravings Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {["Spicy", "Vegetarian", "Seafood", "Healthy", "Rice", "Sweets"].map((craving) => (
              <button
                key={craving}
                onClick={() => setSearchQuery(craving)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border
                  ${searchQuery === craving 
                    ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                    : "bg-white border-stone-900/5 text-stone-600 hover:border-brand-primary/30"
                  }`}
              >
                {craving}
              </button>
            ))}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-stone-400 hover:text-brand-primary ml-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories — minimal pill tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-4">
            {menuCategories.map((cat) => {
              const normalizedName = cat.name.toLowerCase();
              const style = categoryStyles[normalizedName] ?? {
                icon: Utensils,
                gradient: "from-stone-400 to-stone-600",
                accent: "#78716c",
              };
              const Icon = style.icon;
              const isActive = selectedCategoryId === cat.id;
              const itemCount = (groupedMenuItems.get(cat.id) ?? []).length;

              return (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? `${style.accent}18` : "#ffffff",
                    color: isActive ? style.accent : "#57534e",
                    border: isActive ? `1.5px solid ${style.accent}60` : "1.5px solid #e7e5e4",
                    boxShadow: isActive ? `0 2px 16px ${style.accent}20` : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <Icon size={15} />
                  <span>{cat.name}</span>
                  {itemCount > 0 && (
                    <span
                      className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isActive ? `${style.accent}25` : "#f5f5f4",
                        color: isActive ? style.accent : "#a8a29e",
                      }}
                    >
                      {itemCount}
                    </span>
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="pill-active-bg"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ background: `${style.accent}10` }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Food items — photo-first portrait cards */}
        <AnimatePresence mode="wait">
          {selectedCategoryId && !selectedFoodItem && (() => {
            const activeStyle = categoryStyles[selectedCategory?.name.toLowerCase() ?? ""] ?? {
              gradient: "from-stone-400 to-stone-600",
              accent: "#78716c",
              icon: Utensils,
            };
            return (
              <motion.div
                key={`items-${selectedCategoryId}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className="mb-16"
              >
                {/* Inline category header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${activeStyle.gradient}`}
                    >
                      <activeStyle.icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900 leading-none">{selectedCategory?.name}</h3>
                      <p className="text-xs text-stone-400 mt-0.5">{selectedCategory?.description} — tap to order</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-all text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Items */}
                {menuLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-[3/4] rounded-[20px] bg-stone-200 animate-pulse" />
                    ))}
                  </div>
                ) : menuError ? (
                  <div className="text-center py-12 text-rose-500 font-medium">{menuError}</div>
                ) : (groupedMenuItems.get(selectedCategoryId) ?? []).length === 0 ? (
                  <div className="text-center py-16 text-stone-400">
                    <Utensils size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No items in this category yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(groupedMenuItems.get(selectedCategoryId) ?? []).map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06, duration: 0.4 }}
                        whileHover={{ y: -6 }}
                        onClick={() => handleFoodItemClick(item)}
                        className="group cursor-pointer"
                      >
                        {/* Photo */}
                        <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden mb-3 shadow-md shadow-stone-900/10">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          {/* Gradient scrim */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />

                          {/* Badge */}
                          {idx < 2 && (
                            <div
                              className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
                              style={{ background: activeStyle.accent }}
                            >
                              Top Pick
                            </div>
                          )}

                          {/* Bottom: price */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <span className="text-white font-bold text-base">LKR {item.price.toLocaleString()}</span>
                            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <ShoppingBag size={14} style={{ color: activeStyle.accent }} />
                            </span>
                          </div>
                        </div>

                        {/* Info below photo */}
                        <div className="px-1">
                          <h5 className="font-serif font-bold text-stone-900 text-sm leading-snug mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-3 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                            <span className="flex items-center gap-1" style={{ color: activeStyle.accent }}>
                              <Star size={10} className="fill-current" /> {item.rating || "4.8"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {item.prepTime || "25 min"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Order form — cinematic selected item strip */}
        <AnimatePresence mode="wait">
          {selectedFoodItem && selectedCategory && (() => {
            const activeStyle = categoryStyles[selectedCategory.name.toLowerCase()] ?? {
              gradient: "from-stone-400 to-stone-600",
              accent: "#78716c",
              icon: Utensils,
            };
            return (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto mt-10"
              >
                {/* Cinematic selected item strip */}
                <div className="relative rounded-[28px] overflow-hidden mb-8 shadow-xl shadow-stone-900/10">
                  {/* Background food image, blurred */}
                  <img
                    src={selectedFoodItem.imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-stone-900/60" />

                  {/* Foreground content */}
                  <div className="relative z-10 flex gap-5 items-center p-6">
                    <img
                      src={selectedFoodItem.imageUrl}
                      alt={selectedFoodItem.name}
                      className="h-24 w-24 md:h-28 md:w-28 rounded-2xl object-cover flex-shrink-0 border-2 border-white/20 shadow-2xl"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ background: `${activeStyle.accent}90` }}
                      >
                        <activeStyle.icon size={10} /> {selectedCategory.name}
                      </div>
                      <h4 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight truncate">
                        {selectedFoodItem.name}
                      </h4>
                      <p className="text-white/60 text-sm mt-1 line-clamp-1">{selectedFoodItem.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-white">LKR {selectedFoodItem.price.toLocaleString()}</div>
                      <div className="text-white/50 text-xs font-mono uppercase tracking-wider mt-0.5">per serving</div>
                    </div>
                  </div>
                </div>

                <RequestForm
                  category={selectedCategory.name}
                  onCancel={handleFormCancel}
                  onSubmit={handleFormSubmit}
                />
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Active Requests — shown when no food item is selected */}
        <AnimatePresence mode="wait">
          {!selectedFoodItem && (
            <motion.div
              key="requests-list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="mt-20"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-stone-900">Your Active Requests</h3>
                  <p className="text-sm text-stone-500 mt-1">Orders you've placed — track them here.</p>
                </div>
              </div>

              {requests.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white rounded-[40px] border border-dashed border-stone-200 shadow-sm"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary/40 shadow-inner"
                  >
                    <Calendar size={32} />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-stone-900 font-serif mb-2">No active requests</h4>
                  <p className="text-stone-500">Select a category above to place an order!</p>
                </motion.div>
              ) : (
                <div className="grid gap-6">
                  {requests.map((req, index) => {
                    const statusSteps = ['Pending', 'Preparing', 'Ready', 'Delivered'];
                    const currentStep = statusSteps.indexOf(req.status);
                    const displayStatus = req.description.includes('STATUS:')
                      ? req.description.split('STATUS:')[1].trim()
                      : req.status;
                    
                    const isCancelled = displayStatus.toLowerCase() === 'cancelled';
                    const isCompleted = displayStatus.toLowerCase() === 'completed' || displayStatus.toLowerCase() === 'delivered';

                    return (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-[32px] border border-stone-100 shadow-lg shadow-stone-900/5 hover:shadow-xl hover:shadow-brand-primary/10 transition-all p-8 relative overflow-hidden group"
                      >
                        {/* Decorative background blur for active cards */}
                        {!isCancelled && !isCompleted && (
                           <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-brand-primary/10 transition-colors" />
                        )}

                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 relative z-10">
                          {/* Left: title + meta */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4 flex-wrap">
                              <h4 className="text-2xl font-serif font-bold text-stone-900">{req.title}</h4>
                              <span
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                  isCompleted
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-500/10'
                                    : isCancelled
                                    ? 'bg-red-50 text-red-500 border-red-200'
                                    : 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20'
                                }`}
                              >
                                {displayStatus}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-500 mb-8">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-brand-primary">
                                  <Calendar size={14} />
                                </div>
                                <span className="font-medium text-stone-700">
                                  {new Date(req.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-brand-primary">
                                  <Users size={14} />
                                </div>
                                <span className="font-medium text-stone-700">
                                  {req.guests} {req.guests === 1 ? 'Guest' : 'Guests'}
                                </span>
                              </div>
                              {req.location && (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-brand-primary">
                                    <MapPin size={14} />
                                  </div>
                                  <span className="font-medium text-stone-700">
                                    {req.location}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Modern Node-based Progress tracker */}
                            {!isCancelled && (
                              <div className="relative pt-6 mt-6 border-t border-stone-100">
                                {/* Connecting Line background */}
                                <div className="absolute top-10 left-6 right-6 h-1.5 bg-stone-100 rounded-full" />
                                
                                {/* Active Connecting Line */}
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
                                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                                  className="absolute top-10 left-6 h-1.5 bg-brand-primary rounded-full origin-left shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                                />

                                <div className="relative flex justify-between">
                                  {statusSteps.map((step, i) => {
                                    const isStepCompleted = i < currentStep;
                                    const isStepCurrent = i === currentStep;
                                    
                                    return (
                                      <div key={step} className="flex flex-col items-center gap-4 relative z-10 w-24">
                                         {/* Node point */}
                                         <div className="relative">
                                           <motion.div 
                                             initial={false}
                                             animate={{ 
                                                scale: isStepCurrent ? 1.2 : 1,
                                                backgroundColor: isStepCompleted || isStepCurrent ? '#ea580c' : '#f5f5f4',
                                                borderColor: isStepCurrent ? '#ffffff' : 'transparent'
                                             }}
                                             className={`w-6 h-6 rounded-full flex items-center justify-center border-4 transition-colors duration-500 z-10 relative ${
                                               isStepCurrent ? 'shadow-lg shadow-brand-primary/40' : ''
                                             }`}
                                           />
                                           
                                           {/* Pulsing ring for current step */}
                                           {isStepCurrent && !isCompleted && (
                                              <motion.div 
                                                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                                className="absolute inset-0 bg-brand-primary rounded-full -z-10"
                                              />
                                           )}
                                         </div>
                                         
                                         <span className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors duration-500 ${
                                            isStepCompleted || isStepCurrent ? 'text-brand-primary' : 'text-stone-400'
                                         }`}>
                                           {step}
                                         </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: price + chevron */}
                          <div className="flex items-center gap-8 lg:border-l lg:border-stone-100 lg:pl-10 flex-shrink-0 self-center lg:self-stretch">
                            <div className="text-right">
                              <div className="text-3xl font-serif font-bold text-stone-900">
                                LKR {req.budget.toLocaleString()}
                              </div>
                              <div className="text-xs text-stone-400 uppercase font-bold tracking-widest mt-1">
                                Total Amount
                              </div>
                            </div>
                            <button className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group-hover:scale-105 shadow-sm">
                              <ChevronRight size={24} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
