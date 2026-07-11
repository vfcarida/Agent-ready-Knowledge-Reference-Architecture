export interface PiiFinding {
  type: string;
  start: number;
  end: number;
  confidence: number;
  value: string;
}

export interface PiiDetector {
  detect(text: string, locale?: string): Promise<PiiFinding[]>;
}
