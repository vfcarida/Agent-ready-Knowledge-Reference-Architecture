# Risk Register

This register documents the primary risks of deploying the OCF Orchestrator in an enterprise environment.

| Risk ID | Description | Severity | Mitigation |
|---------|-------------|----------|------------|
| RSK-001 | Prompt Injection leading to unauthorized actions. | High | Automation Server requires external token approval. Tokens are hashed to the payload to prevent tampering. |
| RSK-002 | Exposure of sensitive Career PII in logs. | High | OTel interceptors must redact specific fields. |
| RSK-003 | Bot detection blocking automation. | Medium | Playwright runs without evasions. If blocked, gracefully fallback to manual human intervention. |
| RSK-004 | Malicious or buggy tool output poisoning LLM context. | Medium | Strict Zod validation on all OKF documents and tool outputs. |
