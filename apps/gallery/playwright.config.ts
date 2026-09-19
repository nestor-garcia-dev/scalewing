import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:4179',
    browserName: 'chromium',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'desktop-en',
      use: {
        locale: 'en-US',
        timezoneId: 'America/New_York',
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: 'mobile-es',
      use: {
        locale: 'es-ES',
        hasTouch: true,
        timezoneId: 'Europe/Madrid',
        viewport: { width: 390, height: 844 },
        launchOptions: { args: ['--lang=es-ES'] },
      },
    },
    {
      name: 'forced-colors',
      use: {
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
        viewport: { width: 1280, height: 900 },
        forcedColors: 'active',
      },
    },
  ],
  webServer: {
    command: 'pnpm dev --host 127.0.0.1 --port 4179',
    url: 'http://127.0.0.1:4179',
    reuseExistingServer: false,
  },
});
