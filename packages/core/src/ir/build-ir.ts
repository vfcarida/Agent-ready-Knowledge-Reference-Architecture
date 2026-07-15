import type { AgentKnowledgeIR } from "./types.js";
import { runCompilerPipeline } from "../compiler/run-pipeline.js";
import type { ConnectorConfig } from "../connectors/types.js";

export interface BuildOptions {
  bundleId?: string;
  policies?: Record<string, any>;
  targets?: string[];
  capabilities?: any[];
  sources?: ConnectorConfig[];
  generateProvenance?: boolean;
  privacy?: any;
}

export async function buildKnowledgeIR(
  bundlePath: string,
  options: BuildOptions = {},
): Promise<AgentKnowledgeIR> {
  return runCompilerPipeline(bundlePath, options);
}
