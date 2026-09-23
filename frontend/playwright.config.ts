import { defineConfig } from "@playwright/test";

// ---------------------------------------------------------------------------
// Playwright E2E config.
//
// Two modes:
//  1. Mock mode (default)      — `npx playwright test`
//     Frontend only, API calls are intercepted by page.route mocks (see
//     tests/e2e/mocks.ts). Runs anywhere, no backend or database needed.
//  2. Full-stack mode          — `E2E_USE_REAL_BACKEND=1 npx playwright test`
//     Spins up the dev backend (needs the docker-compose Postgres on :5433)
//     alongside the Vite dev server and runs the same flows against real
//     data. Used in CI and for pre-release checks.
// ---------------------------------------------------------------------------

const useRealBackend = !!process.env.E2E_USE_REAL_BACKEND;

const webServer: import("@playwright/test").PlaywrightTestOptions["webServer"][] =
  [
    {
      command: "npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ];

if (useRealBackend) {
  webServer.push({
    command: "cd ../backend && npm run dev",
    url: "http://localhost:8000/api-docs/openapi.json",
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  });
}

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: webServer as never,
});
