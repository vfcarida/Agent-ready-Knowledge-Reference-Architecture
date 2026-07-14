# Maturity and Feature Status

AKCP uses strict, evidence-based maturity levels. We do not claim production readiness without executable evidence (tests, documentation, and working examples).

## Maturity Definitions

| Level | Definition |
|---|---|
| **Stable** | Documented, tested, CI-validated, examples exist, no known critical gaps. Ready for production. |
| **Beta** | Mostly working and tested, API may change, limitations are documented. Ready for non-critical environments. |
| **Alpha** | Implemented enough to inspect, incomplete tests or UX. Use for exploration only. |
| **Experimental** | Exploratory, not recommended for production or stable use. May be removed. |
| **Planned** | Not implemented; docs may describe intent only. |
| **Deprecated** | Supported temporarily with a migration path. Will be removed in a future major version. |

## Current Feature Inventory

| Feature | Current status | Evidence | Missing evidence | Maturity | Action |
|---|---|---|---|---|---|
| AKCP CLI compile | Functional | Unit tests, examples | E2E distribution | Beta | Broaden user testing |
| AK-IR Normalization | Functional | Schema tests | Edge cases | Beta | Expand AST testing |
| MCP Profile Server | Functional | Contract/Security tests | Integration tests | Beta | Add auth flows |
| MCP Automation Server | Mocked / Local | Safety tests | E2E with real dashboard | Alpha | Build dashboard integration |
| Dashboard UI | Stubbed | Package scaffolded | Real React UI | Experimental | Build MVP |
| Career flagship | Demo | Walkthrough | Real-world scale | Stable (Demo) | Broaden use cases |
| IT Ops flagship | Demo | Docs, structure | Full backend logic | Alpha | Complete implementations |
| Customer Support | Concept | Design doc | Implementation | Planned | Begin implementation |
| OCF Legacy CLI (`ocf`) | Legacy | `check:identity` | Complete removal | Deprecated | Remove in v1.0 |
