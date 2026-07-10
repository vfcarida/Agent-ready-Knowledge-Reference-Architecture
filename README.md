# Agent Knowledge Compiler and Control Plane

## What this is

AKCP is an open-source compiler and control plane for turning organizational knowledge into versioned, governed, cost-efficient, agent-consumable artifacts, and for controlling how agents discover, retrieve and act on that knowledge through MCP-compatible capabilities.

## What this is not

- Not just a vector database or probabilistic RAG pipeline.
- Not a generic framework for building AI agents.
- Not an LLM prompt manager.

## Why this exists

AI agents today suffer from structural hallucination: they lack deterministic grounding. Enterprises cannot afford unpredictable agentic behavior. Standard tools solve parts of the problem, but fail to provide a cohesive supply chain from raw documentation to controlled agent side-effects.

## How it relates to OKF, MCP and OpenWiki

- **OKF (Open Knowledge Format):** Provides the static semantic primitives (YAML + Markdown), but lacks a runtime mechanism. AKCP compiles raw OKF into an optimized Agent Knowledge IR (AK-IR).
- **MCP (Model Context Protocol):** A powerful RPC standard, but raw MCP exposes a massive attack surface. AKCP wraps MCP with budgetary controls and human-in-the-loop (HITL) approval boundaries.
- **OpenWiki:** Authors and maintains agent-oriented documentation. OpenWiki _authors_; AKCP _compiles, validates, and controls_.

## Current maturity status

| Surface             | Maturity          | Evidence              | Limitation                 |
| ------------------- | ----------------- | --------------------- | -------------------------- |
| CLI local workspace | Beta              | commands + tests      | no npm release yet         |
| Global npm install  | Planned           | package private       | not available              |
| MCP serving         | Beta/Experimental | server implementation | security hardening ongoing |
| OpenWiki import     | Alpha/Beta        | importer exists       | sync depth limited         |

## Architecture overview

AKCP explicitly separates the lifecycle of agent knowledge into two operational planes:

1. **Build Plane (Compiler):** Ingests raw organizational context, normalizes it, and compiles it into semantically dense, strictly-typed context packs.
2. **Runtime Plane (Control Plane):** Governs how agents discover tools, budgets context retrieval, authorizes side-effects via Human-In-The-Loop (HITL), and provides full auditability.

## Quickstart

### Local workspace flow (Recommended)

As AKCP is not yet published to npm, you must run it directly from source.

```bash
# 1. Clone the repository
git clone https://github.com/vfcarida/Agent-Knowledge-Compiler-and-Control-Plane.git akcp
cd akcp

# 2. Setup the environment
corepack enable
pnpm install --frozen-lockfile
pnpm build

# 3. Validate your environment
pnpm akcp doctor
```

### Published Package (Planned)

_AKCP is not published to npm yet. Use the local workspace flow above._

## CLI usage

| Command          | Status       | Purpose                                | Example                                             |
| ---------------- | ------------ | -------------------------------------- | --------------------------------------------------- |
| `akcp doctor`    | Stable       | Validate local environment             | `akcp doctor`                                       |
| `akcp compile`   | Beta         | Compile knowledge into AK-IR/artifacts | `akcp compile --bundle ./my-project/.agent-context` |
| `akcp validate`  | Beta         | Validate bundle/spec/config            | `akcp validate ./my-project/.agent-context`         |
| `akcp serve:mcp` | Experimental | Serve compiled artifacts through MCP   | `akcp serve:mcp ./my-project/.agent-context`        |

For full details on all 22 commands, see [docs/cli/usage.md](docs/cli/usage.md) and [docs/specs/cli.md](docs/specs/cli.md).

## Flagship demos

To prove the model-independent nature of the compiler and its enterprise value, this repository ships with `examples/domains/`.

- **IT Operations Flagship**: The primary enterprise demo. Showcases platform runbooks, incident response, strict policy-controlled actions, and MCP runtime governance with Human-In-The-Loop (HITL) gates.
- **Career Knowledge Demo**: An individual, approachable onboarding demo.
- **Software Projects**: Included to prove cross-industry extensibility.

## MCP integration

AKCP uses the Model Context Protocol to serve context.

```bash
# Serve your compiled context via MCP
pnpm akcp serve:mcp ./my-project/.agent-context
```

## Conformance and evals

AKCP ships with a rigorous conformance and evaluation suite.

```bash
pnpm test -- --run
```

## Security and governance

AKCP implements strict security controls over agentic execution, enforcing OWASP Top 10 for LLMs policies through machine-readable `PolicyCards`.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for code-level guidelines. We strictly adhere to the NIST AI RMF.

## Roadmap

AKCP evolves as a formal specification.

- **Current focus:** Hardening the React Dashboard for real-time Human-In-The-Loop approvals.
- **Next up:** Remote MCP exposure guidelines and Authentication flows.

## Contributing

Issues and PRs are welcome!

---

_Licensed under MIT._
