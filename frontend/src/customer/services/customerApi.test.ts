import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchCategories,
  fetchCustomerOrders,
  placeOrder,
  acceptQuote,
  cancelOrder,
  fetchUserProfile,
  updateUserProfile,
} from "./customerApi";
import type { BackendOrder } from "./customerApi";

// ---------------------------------------------------------------------------
// customerApi — the fetch layer is stubbed so we can assert mapping logic,
// error-body parsing and auth headers without a backend.
// ---------------------------------------------------------------------------

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

beforeEach(() => {
  fetchMock.mockReset();
  localStorage.clear();
});

function jsonRes(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  };
}

describe("fetchCategories", () => {
  it("sorts the 'Other' category last regardless of server order", async () => {
    fetchMock.mockResolvedValue(
      jsonRes([
        { id: "c3", name: "Other", description: "" },
        { id: "c1", name: "Rice", description: "" },
        { id: "c2", name: "Desserts", description: "" },
      ]),
    );

    const cats = await fetchCategories();
    expect(cats.map((c) => c.name)).toEqual(["Rice", "Desserts", "Other"]);
  });

  it("throws a friendly error when the request fails", async () => {
    fetchMock.mockResolvedValue(jsonRes({}, false, 500));

    await expect(fetchCategories()).rejects.toThrow(
      "Failed to load menu categories",
    );
  });
});

describe("fetchCustomerOrders", () => {
  it("maps backend snake_case orders into the frontend Request shape", async () => {
    const backend: BackendOrder[] = [
      {
        id: "ORD-1",
        foodItemName: "Rice & Curry",
        deliveryDate: "2026-09-20T00:00:00.000Z",
        createdAt: "2026-09-18T10:00:00.000Z",
        quantity: 3,
        totalPrice: "4500",
        status: "Preparing",
        mealDescription: "Spicy chicken rice",
        quoteCount: 2,
      },
    ];
    fetchMock.mockResolvedValue(jsonRes(backend));

    const orders = await fetchCustomerOrders("u-cust-1");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/orders/customer/u-cust-1"),
    );
    expect(orders[0]).toEqual({
      id: "ORD-1",
      title: "Rice & Curry",
      date: "2026-09-20",
      guests: 3,
      budget: 4500,
      status: "Preparing",
      bids: 2,
      location: "Colombo",
      dietary: [],
      description: "Spicy chicken rice STATUS: Preparing",
    });
  });

  it("falls back to createdAt for the date and 1 guest when fields are missing", async () => {
    fetchMock.mockResolvedValue(
      jsonRes([
        {
          id: "ORD-2",
          createdAt: "2026-09-21T08:30:00.000Z",
          status: "Pending",
        },
      ]),
    );

    const orders = await fetchCustomerOrders("u-cust-1");
    expect(orders[0].date).toBe("2026-09-21");
    expect(orders[0].guests).toBe(1);
    expect(orders[0].budget).toBe(0);
    expect(orders[0].bids).toBe(0);
    expect(orders[0].title).toBe("Ordered Item");
  });

  it("throws when the response is not ok", async () => {
    fetchMock.mockResolvedValue(jsonRes({}, false, 500));
    await expect(fetchCustomerOrders("u-cust-1")).rejects.toThrow(
      "Failed to fetch orders",
    );
  });
});

describe("placeOrder", () => {
  it("POSTs the payload as JSON and resolves with the created order", async () => {
    fetchMock.mockResolvedValue(jsonRes({ id: "ORD-NEW" }));

    const result = await placeOrder({
      customerId: "u-cust-1",
      quantity: 2,
      totalPrice: 3000,
      deliveryTime: "18:00",
      mealDescription: "Dinner",
    });

    expect(result.id).toBe("ORD-NEW");
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body).customerId).toBe("u-cust-1");
  });

  it("surfaces the backend error message when available", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Customer ID is required" }),
    });

    await expect(placeOrder({} as never)).rejects.toThrow(
      "Customer ID is required",
    );
  });

  it("falls back to a generic message when the error body is not JSON", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("not json");
      },
    });

    await expect(placeOrder({} as never)).rejects.toThrow(
      "Failed to place order",
    );
  });
});

describe("acceptQuote / cancelOrder", () => {
  it("POSTs the acceptance payload", async () => {
    fetchMock.mockResolvedValue(jsonRes({}));

    await acceptQuote("ORD-1", "QT-1", "u-cust-1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/orders/ORD-1/accept");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      quoteId: "QT-1",
      customerId: "u-cust-1",
    });
  });

  it("PATCHes the cancel endpoint with the customerId", async () => {
    fetchMock.mockResolvedValue(jsonRes({}));

    await cancelOrder("ORD-1", "u-cust-1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/orders/ORD-1/cancel");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body)).toEqual({ customerId: "u-cust-1" });
  });

  it("rejects with the backend error when cancellation fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ error: "Only pending orders can be cancelled" }),
    });

    await expect(cancelOrder("ORD-1", "u-cust-1")).rejects.toThrow(
      "Only pending orders can be cancelled",
    );
  });
});

describe("profile endpoints", () => {
  it("sends the Authorization header from localStorage", async () => {
    localStorage.setItem("token", "jwt-token-123");
    fetchMock.mockResolvedValue(jsonRes({ uid: "u-cust-1" }));

    await fetchUserProfile("u-cust-1");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer jwt-token-123");
  });

  it("omits the Authorization header when no token is stored", async () => {
    fetchMock.mockResolvedValue(jsonRes({ uid: "u-cust-1" }));

    await fetchUserProfile("u-cust-1");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("PUTs profile updates with auth headers", async () => {
    localStorage.setItem("token", "jwt-token-123");
    fetchMock.mockResolvedValue(
      jsonRes({ uid: "u-cust-1", full_name: "New Name" }),
    );

    const result = await updateUserProfile("u-cust-1", {
      full_name: "New Name",
      email: "alice@test.com",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/users/u-cust-1");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({
      full_name: "New Name",
      email: "alice@test.com",
    });
    expect(result.full_name).toBe("New Name");
  });

  it("throws when the profile update fails", async () => {
    localStorage.setItem("token", "jwt-token-123");
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Failed to update profile" }),
    });

    await expect(
      updateUserProfile("u-cust-1", { full_name: "x", email: "x@x.com" }),
    ).rejects.toThrow("Failed to update profile");
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
