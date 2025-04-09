import { defineConfig } from "vitest/config";

export default defineConfig({
   plugins: [],
   test: {
      globals: true,
      environment: "happy-dom",
      include: ["src/**/*.test.{ts,tsx}", "tests/**/*.{ts,tsx}"],
      setupFiles: ["./tests/setup.ts"],
   },
});
