import { describe, it, expect } from "vitest";
import {
  ORDER_STATUS_STEPS,
  isCancelled,
  isCompleted,
  isExpired,
  extractStatusFromDescription,
} from "./orderStatus";

describe("ORDER_STATUS_STEPS", () => {
  it("defines the ordered pipeline", () => {
    expect(ORDER_STATUS_STEPS).toEqual([
      "Pending",
      "Quoted",
      "Preparing",
      "Ready",
      "Delivered",
    ]);
  });
});

describe("isCancelled", () => {
  it("is case-insensitive", () => {
    expect(isCancelled("Cancelled")).toBe(true);
    expect(isCancelled("CANCELLED")).toBe(true);
    expect(isCancelled("cancelled")).toBe(true);
  });

  it("returns false for other statuses", () => {
    expect(isCancelled("Pending")).toBe(false);
    expect(isCancelled("Delivered")).toBe(false);
  });
});

describe("isCompleted", () => {
  it("treats both Completed and Delivered as finished", () => {
    expect(isCompleted("Completed")).toBe(true);
    expect(isCompleted("Delivered")).toBe(true);
  });

  it("returns false for in-flight statuses", () => {
    expect(isCompleted("Preparing")).toBe(false);
    expect(isCompleted("Pending")).toBe(false);
  });
});

describe("isExpired", () => {
  it("matches Expired regardless of case", () => {
    expect(isExpired("Expired")).toBe(true);
    expect(isExpired("EXPIRED")).toBe(true);
  });

  it("returns false for live statuses", () => {
    expect(isExpired("Quoted")).toBe(false);
  });
});

describe("extractStatusFromDescription", () => {
  it("extracts the status embedded after the STATUS: marker", () => {
    expect(
      extractStatusFromDescription("Two plates of rice STATUS: Preparing", "Pending"),
    ).toBe("Preparing");
  });

  it("trims surrounding whitespace", () => {
    expect(extractStatusFromDescription("dinner STATUS:   Ready  ", "x")).toBe("Ready");
  });

  it("falls back to the provided status when the marker is absent", () => {
    expect(extractStatusFromDescription("no marker here", "Quoted")).toBe("Quoted");
  });

  it("returns an empty string when the marker is the last token and no fallback applies", () => {
    expect(extractStatusFromDescription("ends with STATUS:", "")).toBe("");
  });
});
