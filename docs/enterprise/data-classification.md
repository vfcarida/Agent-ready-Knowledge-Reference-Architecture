# Data Classification

All data within an OKF `.okf` bundle must be classified according to organizational standards.

## Public (C1)
- `index.md` basic aggregates (number of skills, etc).
- Published project URLs.

## Internal (C2)
- Internal career progression frameworks.
- Proprietary skills matrix.

## Confidential (C3)
- Salaries.
- Performance reviews.
- Residential addresses.
- Interview feedback.

> [!CAUTION]
> The Profile Server operates entirely locally to prevent C3 data from leaving the host network. If you route the MCP server to a cloud LLM, you MUST ensure a Zero Data Retention (ZDR) agreement is in place.
