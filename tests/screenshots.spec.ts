import { test, expect } from "@playwright/test";
import path from "path";

const ARTIFACTS = path.join("tests", "artifacts");

const SECTIONS = [
  { id: "hero", selector: "#hero" },
  { id: "about", selector: "#about" },
  { id: "skills", selector: "#skills" },
  { id: "work", selector: "#work" },
  { id: "experience", selector: "#experience" },
] as const;

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.label} ${viewport.width}x${viewport.height}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
    });

    test("no horizontal overflow", async ({ page }) => {
      await page.goto("/");
      const ok = await page.evaluate(
        () => document.documentElement.scrollWidth === window.innerWidth,
      );
      expect(ok).toBe(true);
    });

    for (const section of SECTIONS) {
      test(`viewport screenshot — ${section.id}`, async ({ page }) => {
        await page.goto("/");
        const target = page.locator(section.selector);
        await target.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(
            ARTIFACTS,
            `${viewport.label}-${section.id}-${viewport.width}x${viewport.height}.png`,
          ),
          fullPage: false,
        });
      });
    }
  });
}
