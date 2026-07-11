import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "@akcp/mcp-automation-server",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
