# OCF Metrics Dictionary

The following metrics are exposed via the `@ocf/core` OpenTelemetry Meter:

## Counters
- `ocf_mcp_tool_calls_total`: Total number of MCP tool calls executed.
- `ocf_mcp_tool_failures_total`: Total number of MCP tool calls that resulted in errors.
- `ocf_okf_parse_failures_total`: Total number of YAML/Markdown OKF parse failures.
- `ocf_bundle_validation_failures_total`: Total number of OKF bundle validation errors.
- `ocf_bundle_migrations_total`: Total number of OKF bundle migration processes triggered.
- `ocf_automation_previews_total`: Total number of automation job previews requested.
- `ocf_automation_attempts_total`: Total number of Playwright automation workflows triggered.
- `ocf_automation_approval_required_total`: Total number of job submissions requiring explicit human approval.
- `ocf_automation_submission_blocked_total`: Total number of job submissions blocked by policy or HITL.
- `ocf_automation_submission_success_total`: Total number of successful job submissions registered in bundle.

## Histograms
- `ocf_mcp_tool_duration_ms`: Duration of MCP tool executions in milliseconds.
