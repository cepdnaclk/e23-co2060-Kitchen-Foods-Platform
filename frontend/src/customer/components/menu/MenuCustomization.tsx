// ---------------------------------------------------------------------------
// MenuCustomization
// ---------------------------------------------------------------------------
// The interactive "What do you feel like eating today?" menu section.
//
// This is the stateful *container* — it owns the shared UI state (selected
// category, selected food item, search query) and the order-placing logic,
// while delegating rendering to smaller presentational components:
//
//   MenuHeader      → heading
//   SearchBar       → text filter
//   CravingChips    → quick-search chips
//   CategoryPills   → category tabs
//   FoodItemGrid    → food cards for the selected category
//   SelectedItemStrip + RequestForm → order form for a picked item
//   ActiveRequests  → the customer's order list
//
// The three views are mutually exclusive EXCEPT the food grid + the orders
// list, which can appear together (category selected, no item picked yet).
// Each is wrapped in its own AnimatePresence so they animate independently.
// ---------------------------------------------------------------------------

import React, { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import type { FoodItem, Request } from '../../types';
import { useMenuData } from '../../hooks/useMenuData';
import { useCustomerOrders } from '../../hooks/useCustomerOrders';
import { placeOrder } from '../../services/customerApi';
import { MenuHeader } from './MenuHeader';
import { SearchBar } from './SearchBar';
import { CravingChips } from './CravingChips';
import { CategoryPills } from './CategoryPills';
import { FoodItemGrid } from './FoodItemGrid';
import { SelectedItemStrip } from './SelectedItemStrip';
import { ActiveRequests } from '../orders/ActiveRequests';

export const MenuCustomization: React.FC = () => {
  // --- Data (from hooks) ---
  const { categories, items, loading, error } = useMenuData();
  const { requests, setRequests } = useCustomerOrders();

  // --- Local UI state ---
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group items by category, honoring the search query. Used both by the
  // category pills (counts) and the food grid (filtered items).
  const groupedMenuItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const grouped = new Map<string, FoodItem[]>();

    items.forEach((item) => {
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
  }, [items, searchQuery]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // --- Handlers ---
  const handleCategoryClick = (categoryId: string) => {
    // Clicking the active category again collapses it back to the grid-less view.
    if (selectedCategoryId === categoryId && !selectedFoodItem) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
      setSelectedFoodItem(null);
    }
  };

  const handleFoodItemClick = (item: FoodItem) => setSelectedFoodItem(item);
  const handleFormCancel = () => setSelectedFoodItem(null);

  const handleFormSubmit = async (data: Partial<Request>) => {
    // Orders require a logged-in customer.
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login to place an order');
      return;
    }
    const user = JSON.parse(userStr) as { uid: string };

    const orderPayload = {
      customerId: user.uid,
      chefId: selectedFoodItem?.chefId ?? null,
      foodItemId: selectedFoodItem?.id,
      quantity: data.guests || 1,
      totalPrice: data.budget || (selectedFoodItem?.price || 0) * (data.guests || 1),
      deliveryDate: data.date,
      deliveryTime: data.deliveryTime || 'ASAP',
      mealDescription: data.description || `Order for ${selectedFoodItem?.name}`,
    };

    try {
      const newOrder = await placeOrder(orderPayload);

      // Optimistically show the new order at the top of the list.
      const newRequest: Request = {
        id: newOrder.id,
        title: data.title || 'New Request',
        date: data.date || new Date().toISOString().split('T')[0],
        guests: data.guests || 1,
        budget: data.budget || 0,
        status: 'open',
        bids: 0,
        location: 'Current Location',
        dietary: data.dietary || [],
        description: data.description || '',
      };
      setRequests((prev) => [newRequest, ...prev]);

      // Reset the section back to the category grid.
      setSelectedCategoryId(null);
      setSelectedFoodItem(null);
    } catch (err) {
      console.error('Error placing order:', err);
      alert(`Failed to place order: ${(err as Error).message}`);
    }
  };

  return (
    <section
      id="menu"
      className="py-32 bg-brand-cream relative overflow-hidden text-stone-900 border-b border-stone-900/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header: heading + search + chips + category tabs */}
        <div className="text-center">
          <MenuHeader />
          <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
          <CravingChips
            query={searchQuery}
            onSelect={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          <CategoryPills
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            itemsByCategory={groupedMenuItems}
            onSelect={handleCategoryClick}
          />
        </div>

        {/*
          Three independent AnimatePresence blocks (like the pre-refactor code):
          - the food grid shows while a category is selected (alongside the orders)
          - the order form replaces everything once a food item is picked
          - the orders list is always visible unless an item is being ordered
          Keeping them separate means each view animates independently.
        */}

        {/* View 1: food grid for the selected category */}
        <AnimatePresence mode="wait">
          {selectedCategoryId && !selectedFoodItem && (
            <FoodItemGrid
              key={`items-${selectedCategoryId}`}
              category={selectedCategory}
              items={groupedMenuItems.get(selectedCategoryId) ?? []}
              loading={loading}
              error={error}
              onSelectItem={handleFoodItemClick}
              onClose={() => setSelectedCategoryId(null)}
            />
          )}
        </AnimatePresence>

        {/* View 2: order form for the selected food item */}
        <AnimatePresence mode="wait">
          {selectedFoodItem && selectedCategory && (
            <SelectedItemStrip
              key="form"
              item={selectedFoodItem}
              category={selectedCategory}
              onCancel={handleFormCancel}
              onSubmit={handleFormSubmit}
            />
          )}
        </AnimatePresence>

        {/* View 3: the customer's orders (visible whenever no item is picked) */}
        <AnimatePresence mode="wait">
          {!selectedFoodItem && <ActiveRequests key="requests-list" requests={requests} />}
        </AnimatePresence>
      </div>
    </section>
  );
};
