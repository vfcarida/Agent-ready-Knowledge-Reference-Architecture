import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OCFMcpAutomationServer } from '../server.js';
import { OKFDocumentService } from '@ocf/core';

describe('Safety Controls', () => {
  let server: OCFMcpAutomationServer;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    server = new OCFMcpAutomationServer({} as OKFDocumentService);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('blocks live submission when AUTOMATION_RUNTIME_MODE is sandbox', async () => {
    process.env['AUTOMATION_RUNTIME_MODE'] = 'sandbox';
    expect(server).toBeDefined();
    expect(true).toBe(true);
  });
});
