# Testing Strategy

We run multiple levels of tests:

## 1. Unit Tests
Run with `pnpm test:unit` (or just `pnpm test -- --run`).
Focus on pure functions, parsers, and validation schemas.

## 2. Contract Tests
Run with `pnpm test:contract`.
Focus on ensuring the MCP inputs/outputs match expected snapshots and JSON schemas.

## 3. End-to-End Tests
Run with `pnpm test:e2e`.
Focus on browser automation. These tests MUST use the local HTML mock fixtures in `packages/test-fixtures/html/` to prevent live site interaction.
