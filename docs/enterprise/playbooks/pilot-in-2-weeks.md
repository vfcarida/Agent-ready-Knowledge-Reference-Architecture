# Playbook: AKCP Pilot in 2 Weeks

## Objective
Launch a focused, high-value Agent Knowledge Compiler and Control Plane (AKCP) pilot within 14 days to prove ROI, test the developer experience, and establish a beachhead for enterprise scaling.

## Prerequisites
- Node.js >= 18 and `pnpm` installed.
- Access to an existing, isolated knowledge domain (e.g., a specific team's runbooks or developer onboarding docs).
- A designated platform engineer and a subject matter expert (SME).

## Stakeholders
- **Knowledge Owner (SME):** Validates the accuracy of the context pack.
- **Platform Team:** Sets up the AKCP CLI and CI/CD pipelines.
- **Security:** Reviews the initial Policy Card.

## Executable Steps

### Week 1: Knowledge Capture & Compilation
1. **Initialize the Workspace:**
   ```bash
   akcp init ./pilot-workspace --profile software-project
   ```
2. **Author the Knowledge:**
   Copy existing generic wiki docs into the `./pilot-workspace/.agent-context` directory. Add OKF YAML frontmatter (`type: document`, `title: ...`) to each.
3. **Configure the Bundle:**
   Create an `akcp.yaml` specifying `compile.targets = ["ir-json", "openwiki-docs"]`.
4. **Compile and Validate:**
   ```bash
   akcp compile --bundle ./pilot-workspace
   akcp scorecard run --bundle ./pilot-workspace --format markdown
   ```
   Ensure you achieve a scorecard rating of at least 80/100.

### Week 2: Integration & Governance
5. **Establish Basic Policy:**
   Create a basic `.policy.yaml` explicitly defining `defaultAutonomyLevel: read-only`.
6. **Expose to Agents via MCP:**
   Run the local MCP Profile Server to expose the compiled IR to your agent IDE (e.g., Cursor, Cline).
   ```bash
   akcp serve:mcp ./pilot-workspace
   ```
7. **Demonstrate Grounding:**
   Ask your agent a domain-specific question and observe it using the MCP server to fetch the exact, governed context.

## Risks & Limitations
- **Anti-pattern:** Attempting to migrate the entire company wiki at once. Focus on one high-value domain.
- **Anti-pattern:** Starting with autonomous write operations. Stick to `read-only` knowledge retrieval for the pilot.

## Metrics (Before/After)
- **Before:** Agent hallucinates domain-specific architecture details.
- **After:** Agent correctly cites the local OKF bundle with 100% determinism.
- **Metric:** Time spent by agents searching for context (aim for >50% reduction).

## Definition of Done
- A single domain context pack is compiling successfully.
- Scorecard is >80.
- An agent successfully queries the pack via MCP.
- The stakeholders have signed off on the results.
