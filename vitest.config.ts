import { defineConfig } from "vitest/config";

export default defineConfig({
   plugins: [],
   test: {
      globals: true,
      environment: "happy-dom",
      include: ["src/**/*.test.{ts,tsx}", "tests/**/*.{ts,tsx}"],
      exclude: ["tests/setup.ts"],
      setupFiles: ["./tests/setup.ts"],
   },
});
