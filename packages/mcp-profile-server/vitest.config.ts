import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "@akcp/mcp-profile-server",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
