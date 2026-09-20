import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser", fullyParallel: false, workers: 1,
  use: { baseURL: "http://127.0.0.1:4180", trace: "retain-on-failure" },
  webServer: [
    { command: "node tests/fixtures/supabase.mjs", url: "http://127.0.0.1:4181/health", reuseExistingServer: false },
    {
      command: "npm run start -- --hostname 127.0.0.1 --port 4180",
      url: "http://127.0.0.1:4180", reuseExistingServer: false,
      env: { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4181", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "local-test-only-not-a-real-key" },
    },
  ],
});
