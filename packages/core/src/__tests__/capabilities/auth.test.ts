import { describe, it, expect } from "vitest";
import { authenticate, hashApiKey, generateApiKey } from "../../capabilities/auth.js";
import type { AuthConfig } from "../../capabilities/auth.js";

describe("Authentication", () => {
  const testKey = "akcp_test123456";
  const testKeyHash = hashApiKey(testKey);

  const config: AuthConfig = {
    requireAuth: true,
    credentials: [
      {
        agentId: "agent-1",
        apiKey: testKeyHash,
        scopes: ["akcp.read_*", "akcp.list_*"],
        createdAt: new Date().toISOString(),
      },
      {
        agentId: "agent-2",
        apiKey: hashApiKey("akcp_agent2key"),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() - 86400000).toISOString(), // expired yesterday
      },
    ],
  };

  it("should authenticate valid API key", () => {
    const result = authenticate(testKey, config);
    expect(result.authenticated).toBe(true);
    expect(result.agentId).toBe("agent-1");
  });

  it("should reject missing API key", () => {
    const result = authenticate(undefined, config);
    expect(result.authenticated).toBe(false);
    expect(result.reason).toContain("No API key");
  });

  it("should reject invalid API key", () => {
    const result = authenticate("akcp_wrong", config);
    expect(result.authenticated).toBe(false);
    expect(result.reason).toContain("Invalid");
  });

  it("should reject expired API key", () => {
    const result = authenticate("akcp_agent2key", config);
    expect(result.authenticated).toBe(false);
    expect(result.reason).toContain("expired");
  });

  it("should skip auth when requireAuth is false", () => {
    const devConfig: AuthConfig = { requireAuth: false, credentials: [] };
    const result = authenticate(undefined, devConfig);
    expect(result.authenticated).toBe(true);
    expect(result.agentId).toBe("anonymous");
  });

  it("should return scopes from credential", () => {
    const result = authenticate(testKey, config);
    expect(result.scopes).toEqual(["akcp.read_*", "akcp.list_*"]);
  });

  it("generateApiKey should produce valid key pair", () => {
    const { plain, hashed } = generateApiKey();
    expect(plain).toMatch(/^akcp_[a-f0-9]{48}$/);
    expect(hashed).toHaveLength(64); // SHA-256 hex
    expect(hashApiKey(plain)).toBe(hashed);
  });
});
