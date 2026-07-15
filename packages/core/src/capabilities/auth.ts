import crypto from "crypto";

export interface AgentCredential {
  agentId: string;
  apiKey: string;        // hashed (SHA-256)
  scopes?: string[];     // optional: restrict to specific tools
  createdAt: string;
  expiresAt?: string;    // ISO date, optional TTL
}

export interface AuthConfig {
  credentials: AgentCredential[];
  requireAuth: boolean;   // if false, auth is skipped (dev mode)
}

export interface AuthResult {
  authenticated: boolean;
  agentId?: string;
  scopes?: string[];
  reason?: string;
}

export function hashApiKey(plainKey: string): string {
  return crypto.createHash("sha256").update(plainKey).digest("hex");
}

export function generateApiKey(): { plain: string; hashed: string } {
  const plain = `akcp_${crypto.randomBytes(24).toString("hex")}`;
  const hashed = hashApiKey(plain);
  return { plain, hashed };
}

export function authenticate(
  apiKey: string | undefined,
  config: AuthConfig,
): AuthResult {
  if (!config.requireAuth) {
    return { authenticated: true, agentId: "anonymous" };
  }

  if (!apiKey) {
    return {
      authenticated: false,
      reason: "No API key provided. Include _apiKey in request payload or X-AKCP-Key header.",
    };
  }

  const keyHash = hashApiKey(apiKey);
  const credential = config.credentials.find((c) => c.apiKey === keyHash);

  if (!credential) {
    return {
      authenticated: false,
      reason: "Invalid API key.",
    };
  }

  // Check expiration
  if (credential.expiresAt) {
    const expires = new Date(credential.expiresAt);
    if (expires < new Date()) {
      return {
        authenticated: false,
        reason: `API key for agent '${credential.agentId}' has expired.`,
      };
    }
  }

  return {
    authenticated: true,
    agentId: credential.agentId,
    scopes: credential.scopes,
  };
}
