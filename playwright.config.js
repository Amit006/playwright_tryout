require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');


module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  workers: 1,

  use: {
    headless: false,  // Run with visible browser (headed mode)
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});

const config = {
    testDir: './tests',
    timeout: 60000, // 60 seconds
    expect: {
        timeout: 5000 // 5 seconds
    },
    reporter: 'html',
    use: {
        headless: false,
    }
}