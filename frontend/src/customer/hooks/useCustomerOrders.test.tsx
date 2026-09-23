import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useCustomerOrders } from "./useCustomerOrders";

// ---------------------------------------------------------------------------
// useCustomerOrders — loads orders, polls every 30s, no-ops when logged out.
//
// Fake timers use shouldAdvanceTime so microtasks still flow (waitFor keeps
// working) while we can fast-forward the 30s polling interval.
// ---------------------------------------------------------------------------

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

/** Raw backend order shape (what fetchCustomerOrders actually maps). */
const backendOrder = {
  id: "ORD-1",
  foodItemName: "Rice & Curry",
  deliveryDate: "2026-09-20T00:00:00.000Z",
  createdAt: "2026-09-18T10:00:00.000Z",
  quantity: 2,
  totalPrice: 3000,
  status: "Pending",
  mealDescription: "Dinner",
  quoteCount: 1,
};

beforeEach(() => {
  fetchMock.mockReset();
  localStorage.clear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useCustomerOrders", () => {
  it("loads orders for the stored user on mount", async () => {
    localStorage.setItem("user", JSON.stringify({ uid: "u-cust-1" }));
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [backendOrder],
    });

    const { result } = renderHook(() => useCustomerOrders());

    await waitFor(() => expect(result.current.requests).toHaveLength(1));
    expect(result.current.requests[0].id).toBe("ORD-1");
    expect(result.current.requests[0].title).toBe("Rice & Curry");
  });

  it("does not fetch when no user is stored", async () => {
    renderHook(() => useCustomerOrders());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("polls again after 30 seconds", async () => {
    localStorage.setItem("user", JSON.stringify({ uid: "u-cust-1" }));
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [backendOrder],
    });

    renderHook(() => useCustomerOrders());
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("stops polling after unmount", async () => {
    localStorage.setItem("user", JSON.stringify({ uid: "u-cust-1" }));
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [backendOrder],
    });

    const { unmount } = renderHook(() => useCustomerOrders());
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    unmount();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(90_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps previous orders when a refresh fails", async () => {
    localStorage.setItem("user", JSON.stringify({ uid: "u-cust-1" }));
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [backendOrder],
      })
      .mockRejectedValueOnce(new Error("network down"));

    const { result } = renderHook(() => useCustomerOrders());
    await waitFor(() => expect(result.current.requests).toHaveLength(1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(result.current.requests).toHaveLength(1);
    expect(result.current.requests[0].id).toBe("ORD-1");
  });
});
