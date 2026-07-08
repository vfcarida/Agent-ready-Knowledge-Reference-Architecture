# Automation Safety Guidelines

Browser automation (via Playwright) poses significant risks if weaponized. OCF mitigates these risks via architecture:

## 1. Sandbox by Default
The `AUTOMATION_RUNTIME_MODE` environment variable defaults to `sandbox`. In this mode, no real network submissions occur. Data is mock-submitted to a local echo server.

## 2. No Anti-Bot Circumvention
We strictly prohibit the inclusion of `puppeteer-extra-plugin-stealth` or any other CAPTCHA bypass mechanisms. If an ATS blocks the headless browser, it is a legitimate block and the agent must fail gracefully, prompting the user to complete the application manually.

## 3. Data Privacy
Browser profiles are isolated. No tracking scripts or analytics are permitted within the orchestration context.
