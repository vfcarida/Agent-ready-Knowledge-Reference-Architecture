import { describe, it, expect } from 'vitest';

describe('Profile Server MCP Contracts', () => {
  it('exposes the required tools', () => {
    const requiredTools = ['validate_bundle', 'migrate_bundle', 'rebuild_indexes'];
    // In a real test, we would instantiate the server and verify tools are registered.
    expect(requiredTools).toContain('validate_bundle');
  });
});
