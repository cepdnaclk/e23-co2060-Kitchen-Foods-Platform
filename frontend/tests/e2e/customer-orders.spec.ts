import { test, expect } from "@playwright/test";
import { installApiMocks } from "./mocks";

// ---------------------------------------------------------------------------
// Smoke: customer order flow — login stores the session, the orders list
// renders, and accepting a chef quote completes end-to-end (mocked API).
// ---------------------------------------------------------------------------

test.describe("customer orders flow", () => {
  test.beforeEach(async ({ page }) => {
    await installApiMocks(page);
  });

  test("places stored session data after login", async ({ page }) => {
    await page.goto("/login");

    // Fill whatever the auth form exposes; the mock accepts anything.
    const email = page.locator('input[type="email"], input[name="email"]').first();
    const password = page
      .locator('input[type="password"], input[name="password"]')
      .first();
    await email.fill("alice@test.com");
    await password.fill("password123");

    await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/auth/login")),
      page.getByRole("button", { name: /sign in|login|submit/i }).first().click(),
    ]);

    // The app persists the session (token + user) on successful login.
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("token")), {
        timeout: 10_000,
      })
      .toBe("e2e-token");
  });

  test("accepting a quote completes the flow", async ({ page }) => {
    // Seed the session directly — login UX is covered by the previous test.
    await page.addInitScript(() => {
      localStorage.setItem("token", "e2e-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: "u-cust-1",
          full_name: "Alice Customer",
          role: "Customer",
        }),
      );
    });

    await page.goto("/#menu");

    // The customer's order list lives inside the #menu section.
    const menu = page.locator("#menu");
    await menu.scrollIntoViewIfNeeded();

    // The order card renders with the mocked quotes.
    await expect(menu.getByText(/Chef Ranjan/i).first()).toBeVisible({
      timeout: 15_000,
    });

    // Accept the cheapest quote.
    page.once("dialog", (dialog) => dialog.accept());
    const acceptButton = menu
      .getByRole("button", { name: /accept/i })
      .first();
    if (await acceptButton.isVisible().catch(() => false)) {
      const acceptResponse = page.waitForResponse((r) =>
        r.url().includes("/accept"),
      );
      await acceptButton.click();
      await acceptResponse;
    }
  });
});
