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
} from "lucide-react";
import type { FoodCategory, FoodItem, Request } from "../types";
import { RequestForm } from "./RequestForm";
import { motion, AnimatePresence } from "motion/react";
import { mockFoodItems } from "../data/mockFoodItems";

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

        setMenuCategories(categoriesData);
        // Merge API items with mock items for frontend-only expansion
        setMenuItems([...itemsData, ...mockFoodItems]);
      } catch (error) {
        console.error(error);
        setMenuError("Unable to load menu items. Please try again soon.");
      } finally {
        setMenuLoading(false);
      }
    };

    void loadMenu();
  }, [API_BASE_URL]);

  const categoryStyles = {
    "rice & curry": { icon: Soup, color: "text-orange-500" },
    "short eats": { icon: CheckSquare, color: "text-yellow-500" },
    salads: { icon: Leaf, color: "text-green-500" },
    desserts: { icon: IceCream, color: "text-pink-500" },
    beverages: { icon: Coffee, color: "text-blue-500" },
    other: { icon: Utensils, color: "text-purple-500" },
  } as const;

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

  const handleFormSubmit = (data: Partial<Request>) => {
    const newRequest: Request = {
      id: Math.random().toString(36).substr(2, 9),
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
              className="w-full py-5 pl-14 pr-6 rounded-full glass border border-stone-900/10 shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-lg transition-all text-stone-900 placeholder-stone-500"
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {menuCategories.map((cat) => {
              const normalizedName = cat.name.toLowerCase();
              const style = categoryStyles[normalizedName] ?? {
                icon: Utensils,
                color: "text-stone-500",
              };
              const Icon = style.icon;
              const isActive = selectedCategoryId === cat.id;
              const itemCount = (groupedMenuItems.get(cat.id) ?? []).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex flex-col items-center justify-center p-8 rounded-[32px] border transition-all duration-300 group cursor-pointer
                                ${
                                  isActive
                                    ? "bg-brand-primary border-brand-primary text-white shadow-2xl scale-105 z-10 shadow-brand-primary/20"
                                    : "glass border-stone-900/5 hover:border-brand-primary/50 text-stone-900/80 hover:text-stone-900"
                                }
                            `}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform ${
                      isActive
                        ? "bg-stone-900/20 text-stone-900"
                        : `bg-stone-900/5 ${style.color} group-hover:scale-110`
                    }`}
                  >
                    <Icon size={28} />
                  </div>
                  <span className="font-bold font-serif">{cat.name}</span>
                  {itemCount > 0 && (
                    <span
                      className={`mt-2 text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-stone-900/5 text-stone-500"
                      }`}
                    >
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pop-out food items panel for the selected category */}
        <AnimatePresence mode="wait">
          {selectedCategoryId && !selectedFoodItem && (
            <motion.div
              key={`items-${selectedCategoryId}`}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden mb-16"
            >
              <div className="glass rounded-[40px] border border-brand-primary/20 p-8 md:p-10 shadow-2xl shadow-brand-primary/5">
                {/* Category header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-900">
                      {selectedCategory?.name}
                    </h3>
                    <p className="text-sm text-stone-600 mt-1">
                      {selectedCategory?.description} — Tap an item to order.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className="text-sm font-bold text-stone-500 hover:text-brand-primary transition-colors px-4 py-2 rounded-full hover:bg-stone-900/5"
                  >
                    Close ✕
                  </button>
                </div>

                {/* Items grid */}
                {menuLoading ? (
                  <div className="text-center py-12 text-stone-500 font-medium">
                    Loading items...
                  </div>
                ) : menuError ? (
                  <div className="text-center py-12 text-rose-500 font-medium">
                    {menuError}
                  </div>
                ) : (groupedMenuItems.get(selectedCategoryId) ?? []).length === 0 ? (
                  <div className="text-center py-12 text-stone-500 font-medium">
                    No items found in this category.
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {(groupedMenuItems.get(selectedCategoryId) ?? []).map(
                      (item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.35 }}
                          whileHover={{ y: -4, scale: 1.01 }}
                          onClick={() => handleFoodItemClick(item)}
                          className="flex gap-5 p-5 rounded-[24px] border border-stone-900/10 bg-white/60 hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/10 transition-all cursor-pointer group"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-24 w-24 rounded-2xl object-cover group-hover:scale-105 transition-transform flex-shrink-0"
                            loading="lazy"
                          />
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h5 className="text-lg font-serif font-bold text-stone-900 group-hover:text-brand-primary transition-colors truncate">
                                {item.name}
                              </h5>
                              <p className="text-sm text-stone-600 mt-0.5 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-lg font-bold text-brand-primary">
                                LKR {item.price.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full group-hover:bg-brand-primary group-hover:text-white transition-all">
                                <ShoppingBag size={14} />
                                Select
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order form when a food item is selected */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {selectedFoodItem && selectedCategory ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                {/* Selected item summary */}
                <div className="glass rounded-[28px] border border-brand-primary/20 p-5 mb-6 flex gap-5 items-center">
                  <img
                    src={selectedFoodItem.imageUrl}
                    alt={selectedFoodItem.name}
                    className="h-20 w-20 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-brand-primary uppercase tracking-widest mb-1">
                      Selected Item
                    </p>
                    <h4 className="text-xl font-serif font-bold text-stone-900 truncate">
                      {selectedFoodItem.name}
                    </h4>
                    <p className="text-sm text-stone-600">
                      {selectedFoodItem.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xl font-bold text-brand-primary">
                      LKR {selectedFoodItem.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <RequestForm
                  category={selectedCategory.name}
                  onCancel={handleFormCancel}
                  onSubmit={handleFormSubmit}
                />
              </motion.div>
            ) : !selectedFoodItem ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-serif font-bold text-stone-900">
                    Your Active Requests
                  </h3>
                </div>

                <div className="grid gap-6">
                  {requests.length === 0 ? (
                    <div className="text-center py-16 glass rounded-[40px] border border-dashed border-stone-900/20">
                      <div className="w-16 h-16 bg-stone-900/5 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-500">
                        <Calendar size={28} />
                      </div>
                      <h4 className="text-xl font-bold text-stone-900 font-serif mb-2">
                        No active requests
                      </h4>
                      <p className="text-stone-600">
                        Select a category above to create one!
                      </p>
                    </div>
                  ) : (
                    requests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => handleRequestClick(req)}
                        className="glass p-8 rounded-[32px] border border-stone-900/5 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all cursor-pointer group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <div className="flex items-center gap-4 mb-3">
                              <h4 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-brand-primary transition-colors">
                                {req.title}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                        ${req.status === "open" ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-stone-900/10 text-stone-900/60"}`}
                              >
                                {req.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-600 font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={16}
                                  className="text-brand-primary"
                                />
                                {new Date(req.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users
                                  size={16}
                                  className="text-brand-primary"
                                />
                                {req.guests} Guests
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin
                                  size={16}
                                  className="text-brand-primary"
                                />
                                {req.location}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 md:border-l md:border-stone-900/10 md:pl-8">
                            <div className="text-right">
                              <div className="text-3xl font-bold text-stone-900 mb-1">
                                {req.bids}
                              </div>
                              <div className="text-xs text-stone-500 uppercase font-bold tracking-widest font-mono">
                                Active Bids
                              </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-stone-900/5 group-hover:bg-brand-primary flex items-center justify-center text-stone-500 group-hover:text-stone-900 transition-all">
                              <ChevronRight size={24} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
