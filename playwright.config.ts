import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: { trace: "on-first-retry" },
  // Configure the output path for screenshots.
  snapshotPathTemplate: "output/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      scale: "device",
    },
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
