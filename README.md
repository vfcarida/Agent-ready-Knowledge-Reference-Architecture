# 🌌 Agent-ready Knowledge Reference Architecture

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License Badge" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D%2020.0-emerald?style=for-the-badge" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/Spec-OCF%20Profile%20v1.0-6366f1?style=for-the-badge" alt="OCF Spec Badge" />
  <img src="https://img.shields.io/badge/Protocol-MCP%20v1.0-06b6d4?style=for-the-badge" alt="MCP Protocol Badge" />
  <img src="https://img.shields.io/badge/Monorepo-pnpm-a855f7?style=for-the-badge" alt="Pnpm Monorepo Badge" />
  <img src="https://img.shields.io/badge/Tests-56%20Passed-22c55e?style=for-the-badge" alt="Tests Badge" />
</p>

<p align="center">
  <strong>An enterprise-grade reference architecture for building agent-ready organizational knowledge bases using Open Knowledge Format (OKF) and Model Context Protocol (MCP).</strong>
</p>

---

## 📌 Table of Contents

1. [Strategic Overview: From API-First to Agent-First](#1-strategic-overview-from-api-first-to-agent-first)
2. [What This Is (And Is Not)](#2-what-this-is-and-is-not)
3. [Implementation Status](#3-implementation-status)
4. [System Architecture](#4-system-architecture)
5. [The Reference Implementation: Career Management](#5-the-reference-implementation-career-management)
6. [Monorepo Structure](#6-monorepo-structure)
7. [OCF Profile: Career Types](#7-ocf-profile-career-types)
8. [MCP Servers](#8-mcp-servers)
9. [Local-First Execution with Gemma](#9-local-first-execution-with-gemma)
10. [Getting Started & Configuration](#10-getting-started--configuration)
11. [Claude Desktop Integration](#11-claude-desktop-integration)
12. [Security & Automation Policy](#12-security--automation-policy)
13. [Contributing & Spec-Driven Development](#13-contributing--spec-driven-development)
14. [License](#14-license)

---

## 1. Strategic Overview: From API-First to Agent-First

For the past decade, the **"API-first"** strategy successfully drove cloud migration, microservices adoption, and application modernization. However, as software development transitions toward **Agentic AI**, traditional APIs reveal structural limitations. Standard APIs were designed for deterministic, human-authored integrations and often lack the dynamic, self-describing interfaces required for autonomous systems to discover and interact with tools at runtime.

To achieve sustainable AI automation across any industry, systems must be re-architected to provide clean, standardized knowledge and secure execution boundaries.

---

## 2. What This Is (And Is Not)

**What this IS:**
* A reference architecture demonstrating how to combine OKF (static, typed Markdown) with MCP (dynamic agent protocol).
* A demonstration of **Human-in-the-Loop (HITL)** safety boundaries.
* A privacy-by-design approach to personal/enterprise knowledge graphs.

**What this IS NOT:**
* A production-ready "job application bot." The browser automation components are strictly for reference and default to sandbox environments.
* An attempt to evade or bypass ATS (Applicant Tracking System) protections.

---

## 3. Implementation Status

This repository is actively evolving. Below is the honest maturity assessment of current components:

| Component | Status | Description |
| :--- | :--- | :--- |
| **OKF Data Engine** | ✅ Stable | Full Zod schema validation, frontmatter parsing, filesystem CRUD |
| **MCP Profile Server** | ✅ Stable | Exposes OKF context to LLMs securely via tools and resources |
| **MCP Automation Server** | ⚠️ Experimental | Demonstrates HITL Playwright flows; live submission disabled by default |
| **Legacy MCP Server** | ❌ Deprecated | Replaced by the modular profile/automation servers |
| **React Dashboard** | 🏗️ Alpha | Basic Vite/D3 visualization; lacking tests and polish |

---

## 4. System Architecture

The architecture relies on separated concerns: data storage (OKF), protocol transport (MCP Servers), and client consumption (Dashboard & LLMs).

```mermaid
graph TD
    User([User / Candidate]) <-->|Local Host Browser| UI[React Dashboard SPA @ocf/dashboard]
    UI <-->|HTML5 Directory Access| LocalDir[(Local Filesystem: .okf/)]
    
    HostClient([AI Agent / Claude Desktop]) <-->|MCP Transport: stdio| MCPProfile[Profile Server @ocf/mcp-profile-server]
    HostClient <-->|MCP Transport: stdio| MCPAuto[Automation Server @ocf/mcp-automation-server]
    
    MCPProfile <-->|Local Core API| Core[@ocf/core Engine]
    MCPAuto <-->|Local Core API| Core
    
    Core <-->|File CRUD / Parsers| LocalDir
    MCPAuto <-->|Playwright POM Drivers| Browser[Headless Chromium Sandbox]
    Browser <-->|Human-in-the-Loop Gate| ATS[External Platforms]
```

---

## 5. The Reference Implementation: Career Management

To tangibilize this architecture, we implemented the **Open Career Format Orchestrator (OCF)**. The domain of professional career management was selected because it perfectly mirrors the enterprise data problem: user data is heavily fragmented across static PDFs, multiple Applicant Tracking Systems (ATS), and professional networks.

While this implementation focuses on career management, the principles demonstrated here — deterministic data validation, modular MCP connectivity, and privacy-first orchestration — can be adapted to solve agentic workflow challenges in finance, healthcare, or IT operations.

---

## 6. Monorepo Structure

* **`@ocf/core`**: Domain logic, Zod schemas, and OKF markdown repository implementation.
* **`@ocf/mcp-profile-server`**: Read-only MCP server exposing career context to AI clients.
* **`@ocf/mcp-automation-server`**: Stateful MCP server demonstrating Human-in-the-Loop browser orchestration.
* **`@ocf/mcp-server`**: *(Deprecated)* Legacy façade. Side-effects blocked by default.
* **`@ocf/dashboard`**: A browser-safe SPA utilizing Tailwind CSS v4 and D3.js force layouts.

---

## 7. OCF Profile: Career Types

Professional metadata is structured as distinct collections following the OCF Profile v1 specification:

| Concept Type | Folder Path | Purpose | Key Metadata Fields |
| :--- | :--- | :--- | :--- |
| **`Skill`** | `skills/*.md` | Models technical and core competencies | `level`, `yearsOfExperience`, `category` |
| **`Experience`** | `experiences/*.md` | Models professional roles and job history | `company`, `role`, `startDate`, `endDate`, `current` |
| **`Education`** | `education/*.md` | Models academic credentials and studies | `institution`, `degree`, `field`, `location` |
| **`Certificate`** | `certificates/*.md` | Tracks verified certifications | `issuer`, `dateObtained`, `credentialId`, `url` |
| **`Project`** | `projects/*.md` | Models portfolio items and contributions | `url`, `technologies`, `startDate` |
| **`Preference`** | `preferences/*.md` | Models target search parameters and limits | `locations`, `remote`, `salaryRange`, `roles` |
| **`Application`** | `applications/*.md` | Tracks candidates' pipeline funnel | `platform`, `status`, `appliedAt`, `url` |

---

## 8. MCP Servers

The architecture provides granular servers rather than a monolith:

### Profile Server (`@ocf/mcp-profile-server`)
- **Resources**: Exposes `bundle://index`, `bundle://log`, `bundle://documents/{conceptId}`
- **Prompts**: `summarize_career_profile`, `tailor_resume_from_job`
- **Tools**: Validates, queries, and modifies the OKF bundle (e.g., `validate_bundle`, `read_document`)

### Automation Server (`@ocf/mcp-automation-server`)
- Employs a **Human-in-the-Loop** state machine with 15-minute expiring approval tokens.
- **Tools**: `prepare_application` (generates token), `confirm_application_submission` (consumes token).

---

## 9. Local-First Execution with Gemma

Career data contains highly sensitive Personally Identifiable Information (PII). By leveraging the open-weights Google Gemma 4 model family running locally via Ollama, the orchestrator can analyze job postings and generate tailored cover letters entirely on-device.

1. **Install Ollama**: Download from [ollama.com](https://ollama.com).
2. **Pull the Gemma Model**:
   ```bash
   ollama pull gemma4:e4b
   ```
3. **Configure Environment**: Update `.env` (see `.env.example`) to route MCP client traffic to your local Ollama instance.

---

## 10. Getting Started & Configuration

### Prerequisites
* **Node.js**: `>= 20.0`
* **pnpm**: `>= 9.0` (Run `npx pnpm` if not globally installed)

### Installation
Clone the repository and install workspace dependencies:
```bash
git clone https://github.com/vfcarida/agent-ready-knowledge-reference-architecture.git
cd agent-ready-knowledge-reference-architecture
npx pnpm install --frozen-lockfile
```

### Configuration
Copy the `.env.example` file to configure your local setup:
```bash
cp .env.example .env
```
Ensure `OCF_BUNDLE_PATH` points to your `.okf` directory (defaults to `./sample-data/.okf`).

### Build & Test
```bash
npx pnpm build
npx pnpm test -- --run
```

---

## 11. Claude Desktop Integration

To register the servers in **Claude Desktop**, add the following entries to your configuration file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ocf-profile-server": {
      "command": "node",
      "args": [
        "C:\\absolute\\path\\to\\agent-ready-knowledge-reference-architecture\\packages\\mcp-profile-server\\dist\\index.js"
      ],
      "env": {
        "OCF_BUNDLE_PATH": "C:\\absolute\\path\\to\\your\\career-bundle\\.okf"
      }
    },
    "ocf-automation-server": {
      "command": "node",
      "args": [
        "C:\\absolute\\path\\to\\agent-ready-knowledge-reference-architecture\\packages\\mcp-automation-server\\dist\\index.js"
      ],
      "env": {
        "AUTOMATION_RUNTIME_MODE": "sandbox"
      }
    }
  }
}
```

---

## 12. Security & Automation Policy

This repository strictly enforces ethical automation boundaries:
1. **Sandbox Default**: The automation server runs in `sandbox` mode by default, preventing live submissions to real platforms.
2. **Human-in-the-Loop (HITL)**: Execution tools require an explicit token generated by a preparation step. Tokens expire in 15 minutes.
3. **No Anti-Bot Evasion**: We do not provide or support tools to bypass CAPTCHAs, rate limits, or terms of service of external platforms.

---

## 13. Contributing & Spec-Driven Development

We welcome contributions applying Spec-Driven Development (SDD) principles. Please review our `CONTRIBUTING.md` before submitting pull requests.

* Every functional enhancement must start as a specification change.
* Commits must use simple conventional names and must never credit AI/LLMs.

---

## 14. License

This project is licensed under the MIT License.
