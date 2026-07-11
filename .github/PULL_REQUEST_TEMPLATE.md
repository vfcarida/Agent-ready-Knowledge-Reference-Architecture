## Description

Please include a summary of the changes and the related issue or specification they resolve.

- Fixes # (issue)
- Implements architectural plan in `docs/` or `ADR-`

## Spec-Driven Development (SDD) Compliance

- [ ] Architectural boundaries respected (no leaked dependencies/side-effects).
- [ ] Zod schemas updated/created in `@akcp/core` `schemas.ts` if adding career fields.
- [ ] Comprehensive unit, integration, or contract tests added for changes.
- [ ] Bundle backward compatibility verified and migration path documented.
- [ ] No mention of AI, LLMs, or agent assistants in the commit messages or code comments.

## Verification Checklist

- [ ] `pnpm run lint` passes without warnings.
- [ ] `pnpm run typecheck` passes.
- [ ] `pnpm run test` passes (Vitest run).
- [ ] `pnpm run build` compiles successfully.
- [ ] OpenTelemetry spans verified.
