import { test, expect } from "@playwright/test";
import { installApiMocks } from "./mocks";

// ---------------------------------------------------------------------------
// Smoke: the public customer homepage renders its core sections with mocked
// API data.
// ---------------------------------------------------------------------------

test.describe("customer homepage", () => {
  test.beforeEach(async ({ page }) => {
    await installApiMocks(page);
  });

  test("renders the marketing hero and navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).toContainText(/kitchen foods|homemade|chef/i, {
      ignoreCase: true,
    });
    // Primary CTA exists.
    await expect(
      page.getByRole("link", { name: /login|order|menu/i }).first(),
    ).toBeVisible();
  });

  test("shows food items after selecting a category", async ({ page }) => {
    await page.goto("/#menu");

    const menu = page.locator("#menu");
    await menu.scrollIntoViewIfNeeded();

    // Menu items only render once a category pill is selected.
    await menu.getByRole("button", { name: /rice & curry/i }).click();

    await expect(
      menu.getByText("Chicken Rice & Curry").first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("navigates to the login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("body")).toContainText(/email|password|sign in/i, {
      ignoreCase: true,
    });
  });
});
