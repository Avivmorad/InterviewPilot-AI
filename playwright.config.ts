import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev --workspace client -- --host 127.0.0.1 --port 4173',
    timeout: 120_000,
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})
