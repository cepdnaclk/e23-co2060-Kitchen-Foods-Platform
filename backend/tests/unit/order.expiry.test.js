import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Order from "../../src/models/order.model.js";

// ---------------------------------------------------------------------------
// Order.computeExpiry — pure date math, tested with fake timers.
// ---------------------------------------------------------------------------

describe("Order.computeExpiry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-22T10:00:00Z"));
    process.env.BID_WINDOW_HOURS = "6";
    process.env.BID_LEAD_HOURS = "6";
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.BID_WINDOW_HOURS;
    delete process.env.BID_LEAD_HOURS;
  });

  it("uses the default 6h bid window when no delivery time is given", () => {
    const expiresAt = Order.computeExpiry(null, null);
    expect(new Date(expiresAt).toISOString()).toBe(
      new Date("2026-09-22T16:00:00Z").toISOString(),
    );
  });

  it("respects BID_WINDOW_HOURS env override", () => {
    process.env.BID_WINDOW_HOURS = "2";
    const expiresAt = Order.computeExpiry(undefined, undefined);
    expect(new Date(expiresAt).toISOString()).toBe(
      new Date("2026-09-22T12:00:00Z").toISOString(),
    );
  });

  it("clamps to the lead-time boundary when fulfillment is sooner than the window", () => {
    // Fulfillment at 14:00 with a 6h lead => bidding stops at 08:00...
    // but 08:00 is in the past, so the past-clamp guarantee kicks in and
    // the window falls back to 6h from now (16:00).
    const expiresAt = Order.computeExpiry("2026-09-22", "14:00");
    expect(new Date(expiresAt).toISOString()).toBe(
      new Date("2026-09-22T16:00:00Z").toISOString(),
    );
  });

  it("uses the earlier of lead boundary vs bid window when both are in the future", () => {
    // Fulfillment at 21:00 minus 6h lead => 15:00, which is sooner than the
    // default 16:00 window, so 15:00 wins.
    const expiresAt = Order.computeExpiry("2026-09-22", "21:00");
    expect(new Date(expiresAt).toISOString()).toBe(
      new Date("2026-09-22T15:00:00Z").toISOString(),
    );
  });

  it("ignores malformed delivery dates and falls back to the window", () => {
    const expiresAt = Order.computeExpiry("not-a-date", "25:99");
    expect(new Date(expiresAt).toISOString()).toBe(
      new Date("2026-09-22T16:00:00Z").toISOString(),
    );
  });

  it("always returns a fresh order at least 1 minute in the future", () => {
    const expiresAt = Order.computeExpiry("2026-09-22", "10:30");
    expect(new Date(expiresAt).getTime()).toBeGreaterThan(Date.now());
  });
});
