# 6. Human-in-the-Loop Enforcement

Date: 2026-07-08

## Status
Accepted

## Context
Fully autonomous job applications pose severe risks to personal reputation and ATS spam policies.

## Decision
We enforce a two-step `prepare_application` -> `confirm_application_submission` flow using short-lived tokens. The legacy `orchestrate_application` tool is blocked.

## Consequences
Agents cannot apply to jobs autonomously in the background without explicit user consent.
