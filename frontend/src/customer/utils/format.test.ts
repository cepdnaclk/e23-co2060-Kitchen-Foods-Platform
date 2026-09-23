import { describe, it, expect } from "vitest";
import { formatPrice, formatDate } from "./format";

describe("formatPrice", () => {
  it("formats plain amounts with the LKR prefix", () => {
    expect(formatPrice(1850)).toBe("LKR 1,850");
  });

  it("formats zero without a decimal part", () => {
    expect(formatPrice(0)).toBe("LKR 0");
  });

  it("groups thousands", () => {
    expect(formatPrice(125000)).toBe("LKR 125,000");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as '15 Aug 2026' style output", () => {
    // Parsed in UTC to stay deterministic across timezones.
    const result = formatDate("2026-08-15T00:00:00Z");
    expect(result).toMatch(/15 Aug 2026|15 Aug 2026/);
    expect(result).toContain("2026");
    expect(result).toContain("Aug");
    expect(result).toContain("15");
  });

  it("handles date-only strings", () => {
    const result = formatDate("2026-01-01");
    expect(result).toContain("2026");
    expect(result).toContain("Jan");
    expect(result).toContain("1");
  });
});
