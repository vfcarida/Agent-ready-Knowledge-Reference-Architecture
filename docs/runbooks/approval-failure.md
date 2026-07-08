# Runbook: Approval Failure

## Context
When an automated tool execution requiring approval (e.g., `confirm_application_submission`) fails, it usually means the token was invalid, expired, or the payload was tampered with.

## Symptoms
- The MCP tool returns `Execution Blocked` with a message regarding token validation.
- Audit logs show `status: "blocked"` with `sideEffectLevel: "external-submit"`.

## Causes
1. **Expired Token**: Tokens have a hard TTL of 15 minutes.
2. **Payload Mismatch**: The payload submitted with the token doesn't match the payload hashed during token creation (e.g., the LLM hallucinated different input data).
3. **Double Spend**: The token was already consumed.

## Resolution
1. Re-run the preparation step (e.g., `prepare_application`) to generate a new, fresh token.
2. Ensure the payload remains identical during the confirmation step.
3. Validate the `AUTOMATION_RUNTIME_MODE` allows external submissions if you are testing live operations.
