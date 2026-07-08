import crypto from 'crypto';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface ApprovalPayload {
  toolName: string;
  payloadHash: string;
  expiresAt: number;
  metadata?: Record<string, unknown>;
}

export interface PendingApproval {
  token: string;
  toolName: string;
  payloadHash: string;
  expiresAt: number;
  metadata?: Record<string, unknown>;
}

export class ApprovalStore {
  private db: Database.Database;

  constructor() {
    const defaultDbDir = path.resolve(process.env['OCF_BUNDLE_PATH'] || './sample-data/.okf');
    if (!fs.existsSync(defaultDbDir)) {
      fs.mkdirSync(defaultDbDir, { recursive: true });
    }
    
    const dbPath = process.env['OCF_DB_PATH'] || path.join(defaultDbDir, 'approvals.db');
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pending_approvals (
        token TEXT PRIMARY KEY,
        toolName TEXT NOT NULL,
        payloadHash TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        metadata TEXT
      )
    `);
  }

  generateToken(toolName: string, payload: unknown, metadata?: Record<string, unknown>, ttlMs = 15 * 60 * 1000): string {
    const token = crypto.randomBytes(32).toString('hex');
    const payloadHash = this.hashPayload(payload);
    const expiresAt = Date.now() + ttlMs;
    const metaStr = metadata ? JSON.stringify(metadata) : null;

    const stmt = this.db.prepare(
      `INSERT INTO pending_approvals (token, toolName, payloadHash, expiresAt, metadata) VALUES (?, ?, ?, ?, ?)`
    );
    stmt.run(token, toolName, payloadHash, expiresAt, metaStr);
    
    return token;
  }

  getPendingApprovals(): PendingApproval[] {
    const now = Date.now();
    // Clean up expired
    this.db.prepare(`DELETE FROM pending_approvals WHERE expiresAt < ?`).run(now);

    const stmt = this.db.prepare(`SELECT * FROM pending_approvals`);
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      token: row.token,
      toolName: row.toolName,
      payloadHash: row.payloadHash,
      expiresAt: row.expiresAt,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    }));
  }

  validateAndConsume(token: string, toolName: string, payload: unknown): boolean {
    const now = Date.now();
    
    // Cleanup first
    this.db.prepare(`DELETE FROM pending_approvals WHERE expiresAt < ?`).run(now);

    const stmt = this.db.prepare(`SELECT * FROM pending_approvals WHERE token = ?`);
    const record = stmt.get(token) as any;

    if (!record) return false;
    
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
    this.db.prepare(`DELETE FROM pending_approvals WHERE token = ?`).run(token);
    return true;
  }

  revokeToken(token: string): boolean {
    const result = this.db.prepare(`DELETE FROM pending_approvals WHERE token = ?`).run(token);
    return result.changes > 0;
  }

  private hashPayload(payload: unknown): string {
    const data = JSON.stringify(payload || {});
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
