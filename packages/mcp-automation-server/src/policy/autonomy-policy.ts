export type AutonomyLevel = 'observe' | 'advise' | 'act-with-approval';

export type ApprovalMode = 'forbidden' | 'optional' | 'required';

export type SideEffectLevel =
  | 'none'
  | 'local-write'
  | 'external-read'
  | 'external-write'
  | 'external-submit';

export interface ToolPolicy {
  sideEffectLevel: SideEffectLevel;
  approvalMode: ApprovalMode;
  defaultEnabled: boolean;
  requiresExplicitOptIn: boolean;
}

export const autonomyPolicy: Record<string, ToolPolicy> = {
  prepare_application: {
    sideEffectLevel: 'external-read',
    approvalMode: 'optional',
    defaultEnabled: true,
    requiresExplicitOptIn: false,
  },
  confirm_application_submission: {
    sideEffectLevel: 'external-submit',
    approvalMode: 'required',
    defaultEnabled: false,
    requiresExplicitOptIn: true,
  },
};

export function checkPolicy(toolName: string): ToolPolicy | null {
  return autonomyPolicy[toolName] || null;
}
