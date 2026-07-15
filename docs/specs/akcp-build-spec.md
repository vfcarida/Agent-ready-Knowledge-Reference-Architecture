# AKCP Build Spec (CLI)

For the formal specification, see [`spec/akcp-build-spec.md`](../../spec/akcp-build-spec.md).

This page provides a practical guide to using the CLI.

## Quick Reference

```bash
# 1. Initialize a new software engineering context pack
pnpm akcp init ./my-project --profile software

# 2. Add raw documents and let the CLI structure them (Dry run first)
pnpm akcp scan ./my-project/docs --dry-run

# 3. Validate the manually authored schemas
pnpm akcp validate ./my-project/.agent-context

# 4. Compile the final bundle into AK-IR
pnpm akcp compile --bundle ./my-project/.agent-context

# 5. Serve directly to your agent IDE
pnpm akcp serve mcp ./my-project/.agent-context
```
