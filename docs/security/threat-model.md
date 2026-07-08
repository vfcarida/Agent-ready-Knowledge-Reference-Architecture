# Threat Model: Agent-ready Knowledge Reference Architecture

This document outlines the primary security boundaries, identified threats, and mitigations for the OCF Orchestrator architecture.

## 1. System Boundaries & Assets

### Assets
1. **PII Data**: The OKF bundle (`.okf/`) contains highly sensitive personal data (salaries, addresses, full history).
2. **Session Cookies**: Browser contexts maintained by the Automation Server may hold active session tokens for external platforms (LinkedIn, etc.).
3. **Local Filesystem**: The host environment running the MCP servers.

### Boundaries
- **MCP Client ↔ Profile Server**: Read-only exposure of OKF data.
- **MCP Client ↔ Automation Server**: Execution capability for external side-effects.
- **Automation Server ↔ External ATS**: HTTP/WebSocket interactions via Playwright.

## 2. Identified Threats

### T1: Prompt Injection leading to Data Exfiltration
- **Description**: A malicious ATS platform includes prompt injection in a job description. The LLM reads the description, gets hijacked, and attempts to use the Profile Server to read all OKF files and exfiltrate them.
- **Mitigation**:
  - The Profile Server has **no network access** tools. It can only read local files.
  - The Automation Server does not have access to read the OKF filesystem directly.
  - *Recommendation*: Run local LLMs (e.g., Gemma) so no data goes to cloud API providers.

### T2: Prompt Injection leading to Unauthorized Application Submission
- **Description**: A hijacked LLM attempts to automatically accept offers, submit fake data, or mass-apply to jobs using the Automation Server.
- **Mitigation**:
  - **Human-in-the-Loop (HITL)**: The `orchestrate_application` tool in the legacy server is blocked by default.
  - The Automation Server uses a two-step process: `prepare_application` generates an approval token, and `confirm_application_submission` consumes it.
  - **Runtime Enforcements**: `AUTOMATION_RUNTIME_MODE=sandbox` is the default. Live submissions are blocked unless `explicit-authorized-live` is explicitly set in the environment by the user.
  - Tokens expire in 15 minutes.

### T3: Directory Traversal via MCP Tools
- **Description**: A malicious LLM attempts to use `bundle://../.ssh/id_rsa` or similar path traversal attacks to read host files outside the `.okf/` directory.
- **Mitigation**:
  - `FileSystemAdapter` resolves all paths relative to `bundleRoot` and checks if they start with the `bundleRoot` directory. (Note: The core package must rigorously enforce this in `path.resolve` checks).

## 3. Playwright Security Posture

- Playwright is run in headless mode inside the Automation Server.
- We strictly **prohibit** the use of anti-bot evasion scripts (e.g., overriding `webdriver` flags to bypass CAPTCHAs).
- User session data (cookies, localStorage) must be stored in encrypted volumes if persisted across runs.

## 4. Audit & Compliance

- Changes to `package.json` dependencies are monitored via `pnpm audit`.
- Linting tools (`oxlint`) are configured to block `eval()`, `exec()`, and other dangerous dynamic code execution paradigms.
