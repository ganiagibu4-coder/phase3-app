import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("user can search and save a campus event", async ({ page }) => {
  await page.goto("/events");

  await expect(
    page.getByRole("heading", { name: /campus events/i })
  ).toBeVisible();

  const accessibilityScan = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScan.violations).toEqual([]);

  const search = page.getByLabel("Search events");

  await search.fill("AI");

  await expect(page.getByText(/events found/i)).toBeVisible();

  const saveButton = page.getByRole("button", { name: /save/i }).first();

  await saveButton.click();

  await expect(
    page.getByRole("button", { name: /remove.*from favourites/i }).first()
  ).toBeVisible();
});