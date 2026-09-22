import "@testing-library/jest-dom/vitest";

// jsdom lacks localStorage in some configurations — provide a minimal stub
// only if the environment didn't already define it.
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => void store.clear(),
    },
    writable: true,
  });
}
