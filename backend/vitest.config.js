import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit suites run in the default node pool; the DB-backed integration
    // suites are tagged with `files.integration` and run sequentially.
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.js"],
    // Run DB integration tests one file at a time — they share the single
    // test database and truncate tables between suites.
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 20_000,
    hookTimeout: 30_000,
    setupFiles: ["tests/setup/env.js"],
    coverage: {
      reporter: ["text", "html"],
      include: ["src/**"],
      exclude: ["src/index.js", "src/config/initDb.js"],
    },
  },
});
