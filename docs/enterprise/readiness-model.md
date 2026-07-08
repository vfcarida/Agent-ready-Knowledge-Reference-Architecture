# Enterprise Readiness Model

The Open Career Format Orchestrator follows a three-tier readiness model for organizational adoption:

## Level 1: Individual / OSS
- **Knowledge**: Manual Markdown files.
- **MCP**: Local tools running on the user's laptop.
- **Security**: Relies on host OS security.
- **Observability**: Standard out logs.
- **Automation**: Sandbox only.

## Level 2: Team / Department
- **Knowledge**: Validated OKF bundles in shared repositories.
- **MCP**: Contract tests, API keys for server access.
- **Security**: Documented Threat Model and HITL policies.
- **Observability**: OTel traces and Prometheus metrics.
- **Automation**: Approval required for all side effects.

## Level 3: Enterprise / Governed
- **Knowledge**: OKF integrated with internal HR/Knowledge graphs.
- **MCP**: Centralized Enterprise Policy Engine.
- **Security**: Continuous Assurance, NIST AI RMF alignment.
- **Observability**: SLA/SLOs and PII redaction enforced.
- **Automation**: Governed live operations via dedicated orchestration clusters.
