# Agentic Evaluations (Evals)

Because standard unit tests cannot reliably measure the non-deterministic nature of LLM generation, we use an evaluation harness built around the CLEAR framework:

- **Cost**: Token usage and API cost per automation or generation attempt.
- **Latency**: End-to-end execution time.
- **Efficacy**: Quality of the tailored resume or automation success rate.
- **Assurance**: Alignment with human values and absence of harmful hallucinations.
- **Reliability**: Consistency across multiple runs.

## Running Evals

To execute the test suites against the evaluation datasets:
```bash
pnpm -F @ocf/evals run evals
```
