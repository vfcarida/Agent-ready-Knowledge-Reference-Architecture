export interface WAFResult {
  flagged: boolean;
  reason?: string;
  provider: "lakera" | "openai" | "regex-fallback";
}

export interface ISecurityGateway {
  checkPrompt(prompt: string): Promise<WAFResult>;
}

export class LakeraGateway implements ISecurityGateway {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.LAKERA_API_KEY;
  }

  async checkPrompt(prompt: string): Promise<WAFResult> {
    if (!this.apiKey) {
      console.warn("[WAF] LAKERA_API_KEY not set. Falling back to local Regex heuristic.");
      return this.regexFallback(prompt);
    }

    try {
      const response = await fetch("https://api.lakera.ai/v1/prompt_injection", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: prompt })
      });

      if (!response.ok) {
        throw new Error(`Lakera API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Lakera typically returns a "flagged" boolean or "results[0].flagged" depending on the version.
      // Assuming a generic schema where `flagged: true` indicates malicious intent.
      const isFlagged = data.flagged || (data.results && data.results[0]?.flagged);
      
      return {
        flagged: !!isFlagged,
        reason: isFlagged ? "Lakera AI detected potential prompt injection" : undefined,
        provider: "lakera"
      };
    } catch (err: any) {
      console.error(`[WAF] Lakera API call failed (${err.message}). Falling back to local Regex.`);
      return this.regexFallback(prompt);
    }
  }

  private regexFallback(prompt: string): WAFResult {
    // Basic heuristics for SQLi / Prompt Injection / System prompt leaking
    const injectionPatterns = [
      /ignore all previous instructions/i,
      /you are now a/i,
      /system prompt/i,
      /drop table/i,
      /bypass/i
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(prompt)) {
        return {
          flagged: true,
          reason: `Regex heuristics matched injection pattern: ${pattern}`,
          provider: "regex-fallback"
        };
      }
    }

    return {
      flagged: false,
      provider: "regex-fallback"
    };
  }
}
