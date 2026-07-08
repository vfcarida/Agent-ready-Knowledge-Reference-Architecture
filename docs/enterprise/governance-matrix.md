# Governance Matrix

This matrix maps OKF components to standard enterprise governance controls.

| Domain | Control | Implementation |
|--------|---------|----------------|
| Data | PII Masking | OTel redaction filters. |
| Access | Least Privilege | Read-only Profile Server vs Stateful Automation Server. |
| Safety | Human-in-the-Loop | 15-minute TTL Approval Tokens. |
| Audit | Non-repudiation | Structured audit logs for every side-effect attempt. |
| Quality | Continuous Evals | The `@ocf/evals` package running against PRs. |
