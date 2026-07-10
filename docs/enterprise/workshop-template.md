# AKCP Enterprise Alignment Workshop

This template provides a structure for a 2-hour alignment workshop designed to kick off AKCP adoption across cross-functional teams.

## Pre-reads
Participants should read the following before attending:
- `docs/enterprise/playbooks/pilot-in-2-weeks.md`
- The AKCP core thesis (README)

## Attendees
- **Platform Engineering Lead:** To own the infrastructure and CI/CD pipelines.
- **Security/Compliance Lead:** To own the Policy Cards and Gateway rules.
- **Knowledge Domain Owner (SME):** To own the quality of the selected pilot context pack.
- **Agent Builders:** To consume the context pack.

---

## Agenda

### 1. The Problem Statement (15 mins)
Discuss the current state of autonomous agents in the enterprise:
- High hallucination rates due to lack of specific context.
- Security fears regarding unchecked autonomous actions.
- The fragmentation of knowledge (Confluence vs. Codebase).

### 2. Introduction to AKCP (20 mins)
Present the core value proposition:
- **Knowledge as Code:** Open Knowledge Format (OKF) bundles.
- **Deterministic Grounding:** Cryptographic provenance and the Scorecard.
- **Machine-Readable Governance:** Policy Cards and the Zero-Trust Gateway.

### 3. Pilot Selection (45 mins)
Brainstorm potential domains for the initial 2-week pilot.
- Use the **Maturity Matrix** below to select a domain that is currently at Level 1 or 2, with the goal of moving it to Level 3.
- Agree on the specific API catalog or documentation repo to target.

### 4. Define Success & Next Steps (40 mins)
- Define the metrics (e.g., MTTR reduction, token budget efficiency).
- Assign action items based on the `pilot-in-2-weeks.md` playbook.

---

## Enterprise Maturity Matrix

| Level | Characteristics | Goal |
|-------|-----------------|------|
| **1. Ad-hoc** | Knowledge is in wikis. Agents rely on massive, un-chunked files or web scraping. High hallucination risk. | Compile knowledge into OKF. |
| **2. Compiled** | Knowledge is in Git, managed as OKF. Agents load context deterministically. | Expose safe APIs via MCP. |
| **3. Governed** | Agents use MCP for actions. Access is governed by static Policy Cards. Basic security guarantees. | Centralize governance. |
| **4. Enterprise** | Centralized Policy repo. Zero-Trust Gateway routes all traffic. Provenance hashes track all data lineage. | Full enterprise scale. |
