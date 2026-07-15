/**
 * @module http-server
 * @description Entrypoint for the dynamic MCP Profile Server over HTTP/SSE with Bearer Auth.
 */

import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { startTelemetry, type AgentKnowledgeIR } from "@akcp/core";
import { AKCPProfileServer } from "./server.js";

async function main() {
  try {
    startTelemetry();

    const contextPackEnv = process.env["AKCP_CONTEXT_PACK_PATH"];
    if (!contextPackEnv) {
      throw new Error("[AKCP Profile Server] AKCP_CONTEXT_PACK_PATH environment variable is required.");
    }
    
    const contextPackPath = path.resolve(contextPackEnv);
    if (!fs.existsSync(contextPackPath)) {
      throw new Error(`[AKCP Profile Server] Context pack not found at ${contextPackPath}`);
    }

    const irContent = fs.readFileSync(contextPackPath, "utf-8");
    const ir: AgentKnowledgeIR = JSON.parse(irContent);

    const app = express();
    app.use(cors());

    // Basic Auth Middleware
    const expectedToken = process.env["AKCP_AUTH_TOKEN"];
    app.use((req, res, next) => {
      if (!expectedToken) {
        // If no token is configured, allow (or you could reject, but for MVP we allow if not set)
        return next();
      }
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or invalid Bearer token" });
      }
      const token = authHeader.split(" ")[1];
      if (token !== expectedToken) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      next();
    });

    let transport: SSEServerTransport | null = null;

    app.get("/mcp/sse", async (_req, res) => {
      // eslint-disable-next-line no-console
      console.log("[AKCP Profile Server] New SSE connection established");
      transport = new SSEServerTransport("/mcp/messages", res);
      
      const agentIdentity = expectedToken ? "authenticated-agent" : "anonymous-agent";
      
      const mcpProfileServer = new AKCPProfileServer(ir, { policies: ir.policies || {} }, agentIdentity);
      await mcpProfileServer.getServerInstance().connect(transport);
    });

    app.post("/mcp/messages", express.json(), async (req, res) => {
      if (!transport) {
        res.status(400).json({ error: "SSE connection not established" });
        return;
      }
      await transport.handlePostMessage(req, res);
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[AKCP Profile Server] HTTP/SSE Server listening on port ${PORT}`);
      if (expectedToken) {
        // eslint-disable-next-line no-console
        console.log(`[AKCP Profile Server] Auth enabled. Requires Bearer token.`);
      } else {
        console.warn(`[AKCP Profile Server] WARNING: No AKCP_AUTH_TOKEN set. Running without authentication.`);
      }
    });

  } catch (error) {
    console.error("[AKCP Profile Server] Fatal startup error:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[AKCP Profile Server] Unhandled rejection:", err);
  process.exit(1);
});
