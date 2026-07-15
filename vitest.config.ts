import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'packages/core/src/**/*.ts',
        'packages/cli/src/**/*.ts',
        'packages/mcp-profile-server/src/**/*.ts',
        'packages/mcp-automation-server/src/**/*.ts',
      ],
      exclude: [
        '**/__tests__/**',
        '**/dist/**',
        '**/node_modules/**',
        'packages/dashboard/**',
        'packages/evals/**',
        'packages/test-fixtures/**',
      ],
      // TODO: Increase these thresholds gradually to 70% (and 65% for branches) as coverage improves.
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
    benchmark: {
      reporters: ['default'],
    },
  },
});
