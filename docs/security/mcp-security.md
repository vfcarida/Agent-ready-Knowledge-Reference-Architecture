# MCP Security Guidelines

This document outlines the security mechanisms implemented in the OCF MCP Servers.

## 1. Local-First Boundary

The Model Context Protocol establishes a local client-server relationship over standard I/O (stdio). Traffic does not traverse the internet, limiting the attack surface to the local host boundary.

## 2. Permission Model

All read operations via `@akcp/mcp-profile-server` are inherently safe to execute without side effects but expose Personally Identifiable Information (PII).
All write operations to the local bundle (e.g. `create_document`, `update_document`) are isolated to the `.okf` directory explicitly configured via `AKCP_BUNDLE_PATH`. Path traversal is mitigated by strict internal routing.
All external execution operations via `@akcp/mcp-automation-server` (e.g., job submission) are blocked by default.

## 3. Human-In-The-Loop (HITL) Controls

The automation server implements a strict, token-based verification process for destructive or external actions:

1. `prepare_application`: Validates context, establishes parameters, locks the state, and returns a time-limited (15-minute) token securely tied to the exact context payload hash.
2. The User intervenes to review the locked context (via Dashboard or Terminal log).
3. `confirm_application_submission`: The agent provides the token. The server verifies token validity, expiration, tool match, and payload integrity.

## 4. Prompt Injection Defense

Tool descriptors and schema validations strictly define constraints:

- Input parameters are validated via `zod`.
- Responses are typed securely through the JSON `ToolSuccess<T>` and `ToolFailure` structures to prevent malformed text output that could cause LLM hallucinations.
- Known malicious vectors in job URLs (SSRF) are contained by running Playwright locally in sandbox mode unless explicitly overriden.
