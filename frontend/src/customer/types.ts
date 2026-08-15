// ---------------------------------------------------------------------------
// Shared types for the customer frontend.
// ---------------------------------------------------------------------------
// Kept in one place so components, hooks and the API client all agree on
// the shape of the data moving through the app.
// ---------------------------------------------------------------------------

/** A customer's order ("request") as displayed in the UI. */
export interface Request {
  id: string;
  title: string;
  date: string;
  guests: number;
  budget: number;
  status: string;
  bids: number;
  location: string;
  dietary: string[];
  description: string;
  /** Optional time-of-day chosen by the customer (e.g. "18:30"). */
  deliveryTime?: string;
}

/** A food category, e.g. "Rice & Curry", "Desserts". */
export interface FoodCategory {
  id: string;
  name: string;
  description: string;
}

/** A food item / dish offered by a chef. */
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  chefId: string | null;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  rating?: number;
  prepTime?: string;
}

/** Impact statistics shown on the homepage (from GET /stats). */
export interface Stats {
  active_chefs: number;
  meals_served: number;
  income_generated: number;
}
