# Operating Model

## Deployment
1. **Local Mode**: Developers run `mcp-profile-server` locally via `npx` or directly from source. Claude Desktop acts as the client.
2. **Cluster Mode**: The `mcp-automation-server` runs in a secured Kubernetes namespace. It only accepts requests that contain a signed approval token from the internal IAM system.

## Incident Response
- If an agent goes rogue (e.g., submitting hundreds of applications):
  1. Revoke the LLM API key.
  2. Shut down the automation server container.
  3. Rotate all session cookies stored in the Chrome User Data Directory.
