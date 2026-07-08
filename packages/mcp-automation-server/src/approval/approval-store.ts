import crypto from 'crypto';

export interface ApprovalPayload {
  toolName: string;
  payloadHash: string;
  expiresAt: number;
}

export class ApprovalStore {
  private store: Map<string, ApprovalPayload> = new Map();

  generateToken(toolName: string, payload: unknown, ttlMs = 15 * 60 * 1000): string {
    const token = crypto.randomBytes(32).toString('hex');
    const payloadHash = this.hashPayload(payload);
    
    this.store.set(token, {
      toolName,
      payloadHash,
      expiresAt: Date.now() + ttlMs,
    });
    
    return token;
  }

  validateAndConsume(token: string, toolName: string, payload: unknown): boolean {
    const record = this.store.get(token);
    if (!record) return false;
    
    // Check expiration
    if (Date.now() > record.expiresAt) {
      this.store.delete(token);
      return false;
    }
    
    // Check tool match
    if (record.toolName !== toolName) {
      return false;
    }
    
    // Check payload hash match
    const payloadHash = this.hashPayload(payload);
    if (record.payloadHash !== payloadHash) {
      return false;
    }
    
    // Consume token (One-time use)
    this.store.delete(token);
    return true;
  }

  private hashPayload(payload: unknown): string {
    const data = JSON.stringify(payload || {});
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
