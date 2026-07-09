import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { FrontmatterParser } from '@ocf/core';

describe('Domain Adapters Integration', () => {

  it('validates that software-project sample data parses as OKF', () => {
    const evalsDir = path.dirname(fileURLToPath(import.meta.url));
    const sampleFilePath = path.resolve(evalsDir, '../../../examples/domains/software-project/sample-data/adr-001.okf.md');
    
    expect(fs.existsSync(sampleFilePath)).toBe(true);

    const rawContent = fs.readFileSync(sampleFilePath, 'utf-8');
    const parser = new FrontmatterParser();
    const doc = parser.parse(rawContent, sampleFilePath, path.resolve(evalsDir, '../../../examples/domains/software-project/sample-data'));

    expect(doc).toBeDefined();
    expect(doc.frontmatter['type']).toBe('ArchitectureDecisionRecord');
    expect(doc.frontmatter['id']).toBe('ADR-001');
    expect(doc.frontmatter['status']).toBe('accepted');
    expect(doc.conceptId).toBe('adr-001.okf');
    expect(doc.body).toContain('We will use the Open Knowledge Format (OKF)');
  });

});
