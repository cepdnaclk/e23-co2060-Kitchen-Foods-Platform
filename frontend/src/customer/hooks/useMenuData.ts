// ---------------------------------------------------------------------------
// useMenuData
// ---------------------------------------------------------------------------
// Loads food categories + food items in parallel and exposes loading /
// error state. The category list is pre-sorted by the API client so
// "Other" always appears last.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { fetchCategories, fetchFoodItems } from '../services/customerApi';
import type { FoodCategory, FoodItem } from '../types';

export function useMenuData() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true; // guard against setting state after unmount

    const load = async () => {
      try {
        const [cats, foods] = await Promise.all([
          fetchCategories(),
          fetchFoodItems(),
        ]);
        if (!active) return;
        setCategories(cats);
        setItems(foods);
      } catch (err) {
        console.error('Failed to load menu data:', err);
        if (active) setError('Unable to load menu items. Please try again soon.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { categories, items, loading, error };
}
