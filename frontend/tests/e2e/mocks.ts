import type { Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Shared API mocks for E2E tests.
//
// The customer app talks to these endpoints on load / during flows. Routing
// them to static payloads makes the E2E suite hermetic: it exercises the
// full UI without a running backend.
// ---------------------------------------------------------------------------

const API = "**/api/**";

const categories = [
  { id: "c1", name: "Rice & Curry", description: "Traditional plates" },
  { id: "c2", name: "Short Eats", description: "Snacks" },
  { id: "c3", name: "Other", description: "Everything else" },
];

const foodItems = [
  {
    id: "f1",
    name: "Chicken Rice & Curry",
    description: "Home-style spicy chicken with rice",
    price: 1200,
    chefId: "u-chef-1",
    imageUrl: "",
    categoryId: "c1",
    categoryName: "Rice & Curry",
  },
  {
    id: "f2",
    name: "Fish Cutlets",
    description: "Crispy rolled snacks",
    price: 300,
    chefId: "u-chef-1",
    imageUrl: "",
    categoryId: "c2",
    categoryName: "Short Eats",
  },
];

const orders = [
  {
    id: "ORD-1001",
    foodItemName: "Chicken Rice & Curry",
    deliveryDate: "2026-09-20T00:00:00.000Z",
    createdAt: "2026-09-18T10:00:00.000Z",
    quantity: 2,
    totalPrice: 2400,
    status: "Pending",
    mealDescription: "Mild spice, less oil",
    quoteCount: 2,
  },
];

const quotes = [
  {
    id: "QT-1",
    orderId: "ORD-1001",
    chefId: "u-chef-1",
    price: 2200,
    note: "Can deliver early",
    fulfillmentTime: "17:30",
    status: "Pending",
    chefName: "Chef Ranjan",
    chefAvatar: null,
  },
  {
    id: "QT-2",
    orderId: "ORD-1001",
    chefId: "u-chef-2",
    price: 2500,
    note: null,
    fulfillmentTime: "18:00",
    status: "Pending",
    chefName: "Chef Gajan",
    chefAvatar: null,
  },
];

const stats = { mealsServed: 1250, activeChefs: 12, customers: 340 };

/** Install all API mocks on a page. Call before navigating. */
export async function installApiMocks(page: Page) {
  // NOTE: Playwright gives precedence to the most-recently registered route,
  // so the catch-all MUST be registered first — otherwise it swallows every
  // specific route below and the app receives empty objects.
  await page.route(API, (route) => route.fulfill({ json: {} }));
  await page.route("**/api/food/categories", (route) =>
    route.fulfill({ json: categories }),
  );
  await page.route("**/api/food", (route) => route.fulfill({ json: foodItems }));
  await page.route("**/api/stats", (route) => route.fulfill({ json: stats }));
  await page.route("**/api/orders/customer/*", (route) =>
    route.fulfill({ json: orders }),
  );
  await page.route("**/api/quotes/order/*", (route) =>
    route.fulfill({ json: quotes }),
  );

  // Auth + mutations echo generic success payloads.
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      json: {
        token: "e2e-token",
        user: {
          uid: "u-cust-1",
          full_name: "Alice Customer",
          email: "alice@test.com",
          role: "Customer",
          approval_status: null,
        },
      },
    }),
  );
  await page.route("**/api/orders/*/accept", (route) =>
    route.fulfill({ json: { orderStatus: "Quoted" } }),
  );
  await page.route("**/api/orders/*/cancel", (route) =>
    route.fulfill({ json: { status: "Cancelled" } }),
  );
}
