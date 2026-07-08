/**
 * @module observability/otel
 * @description Setup OpenTelemetry SDK Node wrapper for telemetry and metrics.
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import api from '@opentelemetry/api';

let sdk: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry tracer and instrumentations.
 */
export function startTelemetry(): void {
  if (sdk) return;

  sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  });

  try {
    sdk.start();
    console.error('[OCF Telemetry] OpenTelemetry NodeSDK initialized successfully.');
  } catch (err) {
    console.error('[OCF Telemetry] Failed to initialize OpenTelemetry:', err);
  }
}

/**
 * Stop OpenTelemetry SDK Node context.
 */
export async function stopTelemetry(): Promise<void> {
  if (!sdk) return;
  try {
    await sdk.shutdown();
    console.error('[OCF Telemetry] OpenTelemetry NodeSDK shut down.');
  } catch (err) {
    console.error('[OCF Telemetry] Error shutting down OpenTelemetry:', err);
  }
}

// ─── Custom Metrics Definitions ───────────────────────────────────────────────

const meter = api.metrics.getMeter('open-career-format');

// Metrics counters
export const mcpToolCallsCounter = meter.createCounter('ocf_mcp_tool_calls_total', {
  description: 'Total number of MCP tool calls executed',
});

export const mcpToolFailuresCounter = meter.createCounter('ocf_mcp_tool_failures_total', {
  description: 'Total number of MCP tool calls that resulted in errors',
});

export const okfParseFailuresCounter = meter.createCounter('ocf_okf_parse_failures_total', {
  description: 'Total number of YAML/Markdown OKF parse failures',
});

export const bundleMigrationsCounter = meter.createCounter('ocf_bundle_migrations_total', {
  description: 'Total number of OKF bundle migration processes triggered',
});

export const automationAttemptsCounter = meter.createCounter('ocf_automation_attempts_total', {
  description: 'Total number of Playwright automation workflows triggered',
});

export const automationApprovalRequiredCounter = meter.createCounter('ocf_automation_approval_required_total', {
  description: 'Total number of job submissions requiring explicit human approval',
});

export const automationSubmissionSuccessCounter = meter.createCounter('ocf_automation_submission_success_total', {
  description: 'Total number of successful job submissions registered in bundle',
});

export const bundleValidationFailuresCounter = meter.createCounter('ocf_bundle_validation_failures_total', {
  description: 'Total number of OKF bundle validation errors',
});

export const automationPreviewsCounter = meter.createCounter('ocf_automation_previews_total', {
  description: 'Total number of automation job previews requested',
});

export const automationSubmissionBlockedCounter = meter.createCounter('ocf_automation_submission_blocked_total', {
  description: 'Total number of job submissions blocked by policy or HITL',
});

export const mcpToolDurationHistogram = meter.createHistogram('ocf_mcp_tool_duration_ms', {
  description: 'Duration of MCP tool executions in milliseconds',
});
