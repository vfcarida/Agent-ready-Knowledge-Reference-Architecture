# 7. Modular MCP Servers

Date: 2026-07-08

## Status

Accepted

## Context

A monolithic MCP server mixes safe, read-only data (Profile) with dangerous, stateful automation (Playwright).

## Decision

Split the monolithic server into `@akcp/mcp-profile-server` and `@akcp/mcp-automation-server`.

## Consequences

Clients can run the Profile server 24/7 with zero risk of accidental side-effects. The Automation server is only spawned when job application workflows are explicitly triggered.
