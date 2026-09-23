import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["src/setupTests.ts"],
    css: false,
    coverage: {
      reporter: ["text", "html"],
      include: ["src/**"],
      exclude: ["src/main.tsx", "src/admin/main.tsx", "src/chef/main.tsx", "src/customer/main.tsx"],
    },
  },
});
