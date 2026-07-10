# Playbook: API Catalog to MCP Resources

## Objective
Expose your enterprise's existing internal API catalogs (REST, GraphQL, gRPC) to autonomous agents securely by wrapping them in the Model Context Protocol (MCP).

## Prerequisites
- Existing internal APIs.
- A running instance of the AKCP `mcp-automation-server`.

## Stakeholders
- **Platform Engineering:** Manages the API gateway and MCP Server deployments.
- **Security:** Audits the exposed tools and resources.

## Executable Steps

1. **Map the APIs:**
   Identify 2-3 safe, read-only APIs (e.g., querying user profiles, fetching configuration data) for the initial rollout.
2. **Define OKF Resources:**
   Create OKF Markdown documents representing the semantic meaning and usage of these APIs so agents understand *when* to call them.
3. **Configure the Automation Server:**
   Update your `akcp.yaml` to include the `mcp-automation-server` target.
4. **Implement Plugin/Connector:**
   If the API requires custom authentication, create an AKCP build-time plugin (`source-connector` or `normalizer`) to fetch and inject the API schema into the compiled IR.
   ```bash
   akcp plugin validate ./plugins/custom-api-connector
   ```
5. **Enforce Policy:**
   Use Policy Cards to dictate which agents (based on trust level) can access specific MCP tools.

## Risks & Limitations
- **Anti-pattern:** Exposing all internal APIs via MCP simultaneously without access controls.
- **Risk:** Prompt Injection leading to unauthorized API calls. Follow OWASP Top 10 for LLMs and enforce Zero-Trust principles via the AKCP Gateway.

## Metrics (Before/After)
- **Before:** Agents cannot interact with internal enterprise systems.
- **After:** Agents securely query internal data via MCP.
- **Metric:** Number of successful (and blocked) MCP tool invocations logged by the AKCP Gateway.

## Definition of Done
- 2-3 read-only APIs are exposed via the `mcp-automation-server`.
- OKF documentation explicitly describes the API tools.
- Security has audited the Policy Card restricting access.
