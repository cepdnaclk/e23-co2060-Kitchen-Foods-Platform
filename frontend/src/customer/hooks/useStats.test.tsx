import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useStats } from "./useStats";

// ---------------------------------------------------------------------------
// useStats — waits for BOTH the stats request and the 2.5s minimum splash
// duration, so the splash screen never flashes. Stats failure is tolerated.
// ---------------------------------------------------------------------------

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const stats = { mealsServed: 100, activeChefs: 5, customers: 40 };

beforeEach(() => {
  fetchMock.mockReset();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useStats", () => {
  it("stays loading until the minimum splash duration elapses", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => stats });

    const { result } = renderHook(() => useStats());
    expect(result.current.loading).toBe(true);

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 5000 },
    );
    expect(result.current.stats).toEqual(stats);
  });

  it("resolves with null stats when the request fails (decorative)", async () => {
    fetchMock.mockRejectedValue(new Error("stats down"));

    const { result } = renderHook(() => useStats());

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 5000 },
    );
    expect(result.current.stats).toBeNull();
  });
});
