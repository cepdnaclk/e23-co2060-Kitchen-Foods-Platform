import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRequestForm } from "./useRequestForm";

// ---------------------------------------------------------------------------
// useRequestForm — typed field updater for the order form.
// ---------------------------------------------------------------------------

describe("useRequestForm", () => {
  it("starts with sensible defaults", () => {
    const { result } = renderHook(() => useRequestForm());

    expect(result.current.formData).toEqual({
      portions: 1,
      spiceLevel: 1,
      dietary: "",
      customizations: "",
      date: "",
      time: "",
      budget: 500,
    });
  });

  it("updates a single field without touching others", () => {
    const { result } = renderHook(() => useRequestForm());

    act(() => {
      result.current.setField("portions", 5);
    });

    expect(result.current.formData.portions).toBe(5);
    expect(result.current.formData.budget).toBe(500);
  });

  it("supports successive updates to different fields", () => {
    const { result } = renderHook(() => useRequestForm());

    act(() => {
      result.current.setField("spiceLevel", 3);
      result.current.setField("customizations", "Less oil");
      result.current.setField("budget", 2500);
    });

    expect(result.current.formData.spiceLevel).toBe(3);
    expect(result.current.formData.customizations).toBe("Less oil");
    expect(result.current.formData.budget).toBe(2500);
  });
});
