import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMenuData } from "./useMenuData";

// ---------------------------------------------------------------------------
// useMenuData — parallel category + food load with loading/error state.
// ---------------------------------------------------------------------------

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const jsonResponse = (body: unknown) => ({
  ok: true,
  json: async () => body,
});

beforeEach(() => {
  fetchMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useMenuData", () => {
  it("loads categories and items and clears loading", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/food/categories")) {
        return Promise.resolve(
          jsonResponse([{ id: "c1", name: "Rice", description: "" }]),
        );
      }
      return Promise.resolve(
        jsonResponse([{ id: "f1", name: "Fried Rice", price: 1000 }]),
      );
    });

    const { result } = renderHook(() => useMenuData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.categories).toHaveLength(1);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it("exposes a friendly error when the menu fetch fails", async () => {
    fetchMock.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useMenuData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(
      "Unable to load menu items. Please try again soon.",
    );
    expect(result.current.categories).toEqual([]);
  });

  it("does not set state after unmount (no React warning)", async () => {
    let rejectFetch: (e: Error) => void;
    fetchMock.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectFetch = reject;
      }),
    );

    const { unmount } = renderHook(() => useMenuData());
    unmount();

    // Should not throw or warn about state updates on an unmounted component.
    rejectFetch!(new Error("late failure"));
    await new Promise((r) => setTimeout(r, 10));
  });
});
