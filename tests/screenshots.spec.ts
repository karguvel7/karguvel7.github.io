import { test, expect } from "@playwright/test";
import path from "path";

test("desktop layout has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth === window.innerWidth,
  );
  expect(overflow).toBe(true);
  await page.screenshot({
    path: path.join("tests", "artifacts", "desktop-1440x900.png"),
    fullPage: true,
  });
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth === window.innerWidth,
  );
  expect(overflow).toBe(true);
  await page.screenshot({
    path: path.join("tests", "artifacts", "mobile-390x844.png"),
    fullPage: true,
  });
});
