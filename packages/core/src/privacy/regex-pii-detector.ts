import type { PiiDetector, PiiFinding } from "./pii-detector.js";

const PATTERNS: Record<string, RegExp> = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g,
  credit_card: /(?:\d[ -]*?){13,16}/g,
  password: /(?<=password["':\s]*)([A-Za-z0-9@#$%^&+=]{8,})/gi,
};

export class RegexPiiDetector implements PiiDetector {
  async detect(text: string, _locale?: string): Promise<PiiFinding[]> {
    const findings: PiiFinding[] = [];
    
    for (const [type, regex] of Object.entries(PATTERNS)) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(text)) !== null) {
        findings.push({
          type,
          start: match.index,
          end: match.index + match[0].length,
          confidence: 0.8,
          value: match[0],
        });
      }
    }
    
    return findings.sort((a, b) => a.start - b.start);
  }
}
