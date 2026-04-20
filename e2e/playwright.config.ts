import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'front',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200',
      },
      testMatch: '**/front/**/*.spec.ts',
    },
    {
      name: 'back',
      use: {
        baseURL: 'http://localhost:8080',
      },
      testMatch: '**/back/**/*.spec.ts',
    },
  ],
});
