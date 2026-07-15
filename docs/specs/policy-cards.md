# Policy Cards

For the formal specification, see [`spec/policy-cards.md`](../../spec/policy-cards.md).

This page provides a practical guide to using Policy Cards in AKCP.

## Quick Reference

### Example Policy Card

```yaml
apiVersion: policy.akcp.dev/v1alpha1
kind: PolicyCard
metadata:
  name: Strict Enterprise Governance
  description: Highly restrictive policy for sensitive operations.
  version: 1.0.0
spec:
  allowedAgents:
    - "trusted-automation-agent"
  allowedContextPacks:
    - "compliance"
  allowedTools:
    - "read_document"
  forbiddenTools:
    - "delete_document"
  sideEffectRules:
    read: audit
    write: deny
    submit: deny
  approvalRequirements:
    - "*"
  piiHandling: deny
  evidenceRequirements:
    - "Full session recording"
  mappings:
    nist_ai_rmf:
      - GOVERN 1.1
    owasp_llm:
      - LLM06: Excessive Agency
```

### CLI Commands

- **Validate a Policy**: `npx akcp policy validate policies/strict-enterprise.policy.yaml`
- **Explain a Policy**: `npx akcp policy explain policies/strict-enterprise.policy.yaml`
