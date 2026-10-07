import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173/talking-portfolio",
    trace: "on-first-retry",
  },
  webServer: {
    command: "node scripts/serve-basepath.mjs",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
