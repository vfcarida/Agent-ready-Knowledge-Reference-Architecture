# Agent-Ready Knowledge Benchmark Report

**Generated At:** 2026-07-14T16:21:32.483Z

This report compares legacy/raw documentation approaches (Baseline) against AKCP / OKF strategies (Treatment) across 8 scenarios.

## Scenarios

### Raw README vs Context Pack
_Comparing an uncurated flat repository README against a compiled Context Pack._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.60 | 0.95 | +58.3% ✅ |
| Token Cost | 25000.00 | 4000.00 | -84.0% ✅ |
| Latency (ms) | 802.70 | 607.56 | -24.3% ✅ |
| Tool Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Hallucination Rate | 0.30 | 0.05 | -83.3% ✅ |
| Citation Acc. | 0.20 | 0.95 | +375.0% ✅ |
| Unsafe Action Rate | 0.00 | 0.00 | 0.0% ➖ |
| Context Util. | 0.10 | 0.85 | +750.0% ✅ |

### OpenWiki Docs vs Context Pack
_Comparing structured-but-untyped docs (OpenWiki) vs strict schemas (OKF)._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.80 | 0.95 | +18.7% ✅ |
| Token Cost | 15000.00 | 8000.00 | -46.7% ✅ |
| Latency (ms) | 514.61 | 512.33 | -0.4% ✅ |
| Tool Acc. | 0.60 | 0.90 | +50.0% ✅ |
| Hallucination Rate | 0.15 | 0.02 | -86.7% ✅ |
| Citation Acc. | 0.60 | 1.00 | +66.7% ✅ |
| Unsafe Action Rate | 0.00 | 0.00 | 0.0% ➖ |
| Context Util. | 0.40 | 0.80 | +100.0% ✅ |

### OKF Without Budget vs Context Pack With Budget
_Providing raw OKF without compression versus Context Budgeting algorithms._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.90 | 0.95 | +5.6% ✅ |
| Token Cost | 45000.00 | 5000.00 | -88.9% ✅ |
| Latency (ms) | 913.37 | 307.01 | -66.4% ✅ |
| Tool Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Hallucination Rate | 0.05 | 0.05 | 0.0% ➖ |
| Citation Acc. | 0.90 | 0.90 | 0.0% ➖ |
| Unsafe Action Rate | 0.00 | 0.00 | 0.0% ➖ |
| Context Util. | 0.20 | 0.95 | +375.0% ✅ |

### Raw MCP vs Capability Registry
_Testing safety boundaries: Raw MCP allows unchecked operations, Registry blocks them._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.80 | 0.95 | +18.7% ✅ |
| Token Cost | 2000.00 | 2200.00 | +10.0% ❌ |
| Latency (ms) | 401.68 | 461.94 | +15.0% ❌ |
| Tool Acc. | 0.50 | 0.95 | +90.0% ✅ |
| Hallucination Rate | 0.00 | 0.00 | 0.0% ➖ |
| Citation Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Unsafe Action Rate | 0.40 | 0.00 | -100.0% ✅ |
| Context Util. | 1.00 | 1.00 | 0.0% ➖ |

### Prompt Injection in Docs
_Adversarial docs triggering unwanted side effects vs sanitized context packing._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.10 | 0.90 | +800.0% ✅ |
| Token Cost | 5000.00 | 5000.00 | 0.0% ➖ |
| Latency (ms) | 699.60 | 758.32 | +8.4% ❌ |
| Tool Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Hallucination Rate | 0.90 | 0.00 | -100.0% ✅ |
| Citation Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Unsafe Action Rate | 0.80 | 0.00 | -100.0% ✅ |
| Context Util. | 0.00 | 0.80 | +100.0% ✅ |

### SE Task: Implement Feature
_"Implement feature following architecture" against raw codebase vs architecture pack._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.50 | 0.95 | +90.0% ✅ |
| Token Cost | 80000.00 | 6000.00 | -92.5% ✅ |
| Latency (ms) | 2005.38 | 609.90 | -69.6% ✅ |
| Tool Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Hallucination Rate | 0.40 | 0.05 | -87.5% ✅ |
| Citation Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Unsafe Action Rate | 0.00 | 0.00 | 0.0% ➖ |
| Context Util. | 0.05 | 0.90 | +1700.0% ✅ |

### Enterprise Task: Summarize Policy & Risk
_"Summarize policy and highlight risk" using free-form docs vs enterprise profile._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.60 | 0.98 | +63.3% ✅ |
| Token Cost | 35000.00 | 3500.00 | -90.0% ✅ |
| Latency (ms) | 1203.85 | 510.93 | -57.6% ✅ |
| Tool Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Hallucination Rate | 0.25 | 0.01 | -96.0% ✅ |
| Citation Acc. | 0.30 | 0.98 | +226.7% ✅ |
| Unsafe Action Rate | 0.10 | 0.00 | -100.0% ✅ |
| Context Util. | 0.20 | 0.85 | +325.0% ✅ |

### Tool Selection Ambiguity
_Tests whether an agent avoids dangerous tools due to clear "When NOT to use" clauses._

| Metric | Baseline | Treatment | Delta |
|---|---|---|---|
| Task Success Rate | 0.20 | 0.95 | +375.0% ✅ |
| Token Cost | 5000.00 | 4000.00 | -20.0% ✅ |
| Latency (ms) | 604.91 | 607.73 | +0.5% ❌ |
| Tool Acc. | 0.10 | 0.99 | +890.0% ✅ |
| Hallucination Rate | 0.00 | 0.00 | 0.0% ➖ |
| Citation Acc. | 1.00 | 1.00 | 0.0% ➖ |
| Unsafe Action Rate | 0.70 | 0.00 | -100.0% ✅ |
| Context Util. | 0.40 | 0.80 | +100.0% ✅ |

