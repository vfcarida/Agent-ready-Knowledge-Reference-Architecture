# Playbook: Enterprise Governance Rollout

## Objective
Establish a centralized, machine-readable governance framework across all agent workspaces using Policy Cards and the Zero-Trust Gateway.

## Prerequisites
- Successful AKCP pilots demonstrating basic capability.
- An established AI Platform Team or Center of Excellence (CoE).

## Stakeholders
- **AI Platform Team:** Manages the enterprise policy bundles.
- **CISO / Compliance:** Defines the risk appetite and specific tool constraints.
- **Agent Builders:** Must conform to the published policies.

## Executable Steps

1. **Centralize Policies:**
   Create an internal repository for enterprise policies. Define your `enterprise-default.policy.yaml` enforcing minimum standards (e.g., `defaultAutonomyLevel: read-only`, `piiHandling: mask`).
2. **Publish Policy Bundle:**
   Use the `policy-bundle` target in your central repo to compile and distribute the policy.
   ```bash
   akcp compile --target policy-bundle
   ```
3. **Enforce Downstream:**
   Require all individual domain context packs (e.g., `software-project-a`) to inherit from the enterprise policy bundle in their `akcp.yaml`.
4. **Deploy the Gateway:**
   Instead of agents directly calling the `mcp-automation-server`, route all traffic through the `AKCPGateway`.
   Configure the Gateway to strictly evaluate the compiled `.policy.yaml` before forwarding MCP tool calls.
5. **NIST AI RMF Alignment:**
   Map your policy rules to NIST categories (Measure, Manage, Govern). Use the `akcp policy explain` command to generate human-readable audit reports for compliance teams.

## Risks & Limitations
- **Anti-pattern:** Creating policies so strict that agents cannot perform useful work (e.g., banning all network access unconditionally).
- **Risk:** Gateway becomes a bottleneck. Ensure the Gateway is deployed with high availability and minimal latency overhead.

## Metrics (Before/After)
- **Before:** Decentralized, ad-hoc agent deployments with inconsistent security postures.
- **After:** Unified, policy-as-code governance that is cryptographically verifiable.
- **Metric:** 100% of production agent workspaces covered by a central Policy Card.

## Definition of Done
- Enterprise default policy is published.
- The AKCP Gateway is deployed and actively blocking unauthorized MCP tool calls.
- Compliance team has reviewed and approved the `akcp policy explain` output.
