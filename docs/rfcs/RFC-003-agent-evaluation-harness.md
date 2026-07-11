# RFC 3: Agent Evaluation Harness

## Proposal

Adopt the CLEAR framework (Cost, Latency, Efficacy, Assurance, Reliability) for automated agent testing.

## Rationale

Unit tests do not capture the non-deterministic reality of LLM outputs. We need a harness that evaluates how well the agent extracts metadata or tailors a resume.

## Status

Implemented minimal harness in `@akcp/evals`.
