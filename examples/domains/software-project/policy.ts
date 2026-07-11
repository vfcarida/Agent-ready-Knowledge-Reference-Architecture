import type { AgentPolicy } from "@akcp/core";

export const softwareProjectPolicy: AgentPolicy = {
  policyId: "sw-proj-standard-01",
  autonomyLevel: "act-with-approval",
  allowedReadScopes: ["software-project", "architecture", "requirements"],
  allowedWriteScopes: ["software-project"],
  allowedTools: ["*"],
  deniedTools: ["delete_repository"],
  approvalRequiredFor: ["propose_architecture", "merge_pull_request"],
  piiHandling: "allow-with-audit",
  loggingLevel: "standard",
};
