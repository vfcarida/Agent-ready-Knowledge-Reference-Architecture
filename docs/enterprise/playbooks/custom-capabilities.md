# Playbook: Building Custom Capabilities

This playbook outlines how to build and register custom MCP Tools and Compiler targets for the Agent Knowledge Compiler and Control Plane (AKCP).

## 1. Creating Custom MCP Tools

The AKCP Control Plane leverages the Model Context Protocol (MCP) to expose capabilities to agents. By default, it provides the `mcp-profile-server` (read-only context) and `mcp-automation-server` (read/write capabilities with HITL gates).

To create a custom tool, you must follow the `MCPGateway` pattern to ensure it respects the Zero-Trust architecture.

### 1.1 Defining the Tool

Define your tool using the `@modelcontextprotocol/sdk` and `zod` for input validation.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  MCPGateway,
  withToolTracing,
  createToolSuccess,
  createToolFailure,
} from "@akcp/core";

export function registerCustomTool(server: McpServer, gateway: MCPGateway) {
  server.tool(
    "my_custom_tool",
    "Description of what my custom tool does",
    {
      targetId: z.string().describe("The ID to target"),
      _agentId: z.string().optional().describe("Agent Identity"),
    },
    async ({ targetId, _agentId }) => {
      const reqId = crypto.randomUUID();
      const toolName = "my_custom_tool";
      const toolVersion = "1.0.0";

      try {
        const { data, durationMs } = await gateway.execute(
          {
            requestId: reqId,
            toolName,
            sideEffect: "write", // 'read', 'write', 'submit'
            agentId: _agentId,
            payload: { targetId },
          },
          async () => {
            return await withToolTracing(
              toolName,
              toolVersion,
              reqId,
              async () => {
                // Your custom logic here
                return { result: "success", id: targetId };
              },
            );
          },
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createToolSuccess(data, {
                  requestId: reqId,
                  toolName,
                  toolVersion,
                  durationMs,
                }),
                null,
                2,
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createToolFailure(err.message, "TOOL_ERROR", {
                  requestId: reqId,
                  toolName,
                  toolVersion,
                  durationMs: 0,
                }),
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}
```

### 1.2 Policy Card Integration

Once your tool is registered, it will automatically be governed by the `MCPGateway`. Ensure you update your `policy.yaml` to explicitly allow access to it:

```yaml
version: "1.0"
policies:
  my_custom_tool:
    default_action: deny
    rules:
      - identity: "agent:recruiter-bot"
        action: allow
        conditions:
          time_of_day: "business_hours"
```

## 2. Creating Custom Compiler Targets

The AKCP Build Plane compiles OKF documents into an Intermediate Representation (AK-IR) and then emits targets.

To add a new target, create a new script in `packages/core/src/cli/` or register a new emission step in `buildKnowledgeIR`.

### 2.1 Implementing an Emitter

```typescript
import { OKFDocument } from "../domain/types.js";

export function emitCustomTarget(docs: OKFDocument[], outputPath: string) {
  // Transform the OKF docs into your target format
  const transformed = docs.map((doc) => ({
    id: doc.conceptId,
    type: doc.type,
    metadata: doc.frontmatter,
  }));

  // Write to output path
  fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2));
}
```

### 2.2 Wire into the Build Process

Call your emitter at the end of the `buildKnowledgeIR` flow:

```typescript
// in core/src/ir/build-ir.ts
if (options.emitCustom) {
  emitCustomTarget(documents, path.join(options.outputDir, "custom.json"));
}
```

## Summary

By extending MCP Tools through the `MCPGateway` and adding new Compiler Targets, you can integrate AKCP into any existing enterprise ecosystem while maintaining strict governance and cryptographic verifiability.
