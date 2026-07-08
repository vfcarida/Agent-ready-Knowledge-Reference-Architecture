/**
 * @module server
 * @description Configures tools, resources, and prompts for the MCP Profile Server.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import path from 'node:path';
import { z } from 'zod';
import {
  OKFDocumentService,
  mcpToolCallsCounter,
  mcpToolFailuresCounter,
  bundleMigrationsCounter,
  okfParseFailuresCounter,
  migrateBundle,
  FileSystemAdapter,
  FrontmatterParser,
  CareerFrontmatterSchema,
  OKFDocumentType,
  IndexService
} from '@ocf/core';

export class OCFMcpProfileServer {
  private readonly server: McpServer;
  private readonly docService: OKFDocumentService;

  constructor(docService: OKFDocumentService) {
    this.docService = docService;

    // Create the MCP server instance
    this.server = new McpServer({
      name: 'open-career-format-profile-server',
      version: '0.1.0',
    });

    this.registerResources();
    this.registerPrompts();
    this.registerTools();
  }

  getServerInstance(): McpServer {
    return this.server;
  }

  /**
   * Register resources: bundle://index, bundle://log, bundle://documents/{conceptId}
   */
  private registerResources(): void {
    // Resource: bundle://index
    this.server.resource(
      'bundle-index',
      'bundle://index',
      {
        mimeType: 'text/markdown',
        description: 'Chronological indices catalog listing all folders in the bundle',
      },
      async () => {
        const doc = await this.docService.getDocument('index');
        return {
          contents: [
            {
              uri: 'bundle://index',
              mimeType: 'text/markdown',
              text: doc ? doc.body : '# Bundle Index empty',
            },
          ],
        };
      }
    );

    // Resource: bundle://log
    this.server.resource(
      'bundle-log',
      'bundle://log',
      {
        mimeType: 'text/markdown',
        description: 'Audit log tracking bundle modifications',
      },
      async () => {
        const doc = await this.docService.getDocument('log');
        return {
          contents: [
            {
              uri: 'bundle://log',
              mimeType: 'text/markdown',
              text: doc ? doc.body : '# Bundle Log empty',
            },
          ],
        };
      }
    );

    // Resource template: bundle://documents/{conceptId}
    this.server.resource(
      'bundle-document',
      new ResourceTemplate('bundle://documents/{conceptId}', { list: undefined }),
      async (uri, { conceptId }) => {
        if (typeof conceptId !== 'string') {
          throw new Error('conceptId must be a string');
        }
        const doc = await this.docService.getDocument(conceptId);
        if (!doc) {
          throw new Error(`Document not found: ${conceptId}`);
        }
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'text/markdown',
              text: `---\n${JSON.stringify(doc.frontmatter, null, 2)}\n---\n\n${doc.body}`,
            },
          ],
        };
      }
    );
  }

  /**
   * Register prompts: summarize_career_profile, tailor_resume_from_job
   */
  private registerPrompts(): void {
    this.server.prompt(
      'summarize_career_profile',
      {},
      () => ({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: 'Please review my skills and experience from the career bundle and compile a concise 2-sentence elevator pitch.',
            },
          },
        ],
      })
    );

    this.server.prompt(
      'tailor_resume_from_job',
      {
        jobTitle: z.string().describe('Target job title'),
      },
      (args) => ({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Generate suggested resume adjustments highlighting my experiences related to: ${args.jobTitle}.`,
            },
          },
        ],
      })
    );
  }

  /**
   * Register tools
   */
  private registerTools(): void {
    // Tool list_documents
    this.server.tool('list_documents', {}, async () => {
      mcpToolCallsCounter.add(1);
      try {
        const context = await this.docService.getCareerContext();
        const docs = [
          ...context.skills,
          ...context.experiences,
          ...context.applications,
          ...context.preferences,
          ...context.education,
          ...context.certificates,
          ...context.projects,
        ];
        const text = docs.map((d) => `- ${d.conceptId} (${d.frontmatter.type})`).join('\n');
        return { content: [{ type: 'text', text }] };
      } catch (err: any) {
        mcpToolFailuresCounter.add(1);
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    });

    // Tool read_document
    this.server.tool('read_document', { conceptId: z.string() }, async ({ conceptId }) => {
      mcpToolCallsCounter.add(1);
      try {
        const doc = await this.docService.getDocument(conceptId);
        if (!doc) {
          throw new Error(`Document not found: ${conceptId}`);
        }
        return {
          content: [
            {
              type: 'text',
              text: `---\n${JSON.stringify(doc.frontmatter, null, 2)}\n---\n\n${doc.body}`,
            },
          ],
        };
      } catch (err: any) {
        mcpToolFailuresCounter.add(1);
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    });

    // Tool create_document
    this.server.tool(
      'create_document',
      {
        conceptId: z.string(),
        frontmatter: z.record(z.any()),
        body: z.string(),
      },
      async ({ conceptId, frontmatter, body }) => {
        mcpToolCallsCounter.add(1);
        try {
          await this.docService.createDocument(frontmatter as any, body, conceptId);
          return {
            content: [{ type: 'text', text: `Document '${conceptId}' successfully created.` }],
          };
        } catch (err: any) {
          mcpToolFailuresCounter.add(1);
          okfParseFailuresCounter.add(1);
          return { isError: true, content: [{ type: 'text', text: err.message }] };
        }
      }
    );

    // Tool update_document
    this.server.tool(
      'update_document',
      {
        conceptId: z.string(),
        updates: z.record(z.any()),
        bodyUpdate: z.string().optional(),
      },
      async ({ conceptId, updates, bodyUpdate }) => {
        mcpToolCallsCounter.add(1);
        try {
          await this.docService.updateDocument(conceptId, updates, bodyUpdate);
          return {
            content: [{ type: 'text', text: `Document '${conceptId}' successfully updated.` }],
          };
        } catch (err: any) {
          mcpToolFailuresCounter.add(1);
          return { isError: true, content: [{ type: 'text', text: err.message }] };
        }
      }
    );

    // Tool delete_document
    this.server.tool('delete_document', { conceptId: z.string() }, async ({ conceptId }) => {
      mcpToolCallsCounter.add(1);
      try {
        await this.docService.deleteDocument(conceptId);
        return {
          content: [{ type: 'text', text: `Document '${conceptId}' successfully deleted.` }],
        };
      } catch (err: any) {
        mcpToolFailuresCounter.add(1);
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    });

    // Tool validate_bundle
    this.server.tool('validate_bundle', {}, async () => {
      mcpToolCallsCounter.add(1);
      try {
        const bundlePath = this.docService.bundleRootPath;
        const fsAdapter = new FileSystemAdapter();
        const fmParser = new FrontmatterParser();
        const relativeFiles = await fsAdapter.listFiles(bundlePath);
        const RESERVED_FILENAMES = new Set(['index.md', 'log.md']);
        
        let validCount = 0;
        let invalidCount = 0;
        const errors: string[] = [];
        
        for (const relPath of relativeFiles) {
          if (!relPath.endsWith('.md') || RESERVED_FILENAMES.has(path.basename(relPath))) continue;
          const fullPath = path.join(bundlePath, relPath);
          try {
            const content = await fsAdapter.readFile(fullPath);
            const doc = fmParser.parse(content, fullPath, bundlePath);
            const validation = CareerFrontmatterSchema.safeParse(doc.frontmatter);
            if (validation.success) {
              validCount++;
            } else {
              invalidCount++;
              errors.push(`[${relPath}] ${validation.error.message}`);
            }
          } catch (err: any) {
            invalidCount++;
            errors.push(`[${relPath}] Parse error: ${err.message}`);
          }
        }
        
        return {
          content: [{
            type: 'text',
            text: `Validation complete.\nValid documents: ${validCount}\nInvalid documents: ${invalidCount}\n${errors.length > 0 ? 'Errors:\n' + errors.join('\n') : ''}`
          }]
        };
      } catch (err: any) {
        mcpToolFailuresCounter.add(1);
        return { isError: true, content: [{ type: 'text', text: `Validation Error: ${err.message}` }] };
      }
    });

    // Tool migrate_bundle
    this.server.tool('migrate_bundle', { write: z.boolean().optional().default(false) }, async ({ write }) => {
      mcpToolCallsCounter.add(1);
      bundleMigrationsCounter.add(1);
      try {
        const fsAdapter = new FileSystemAdapter();
        const fmParser = new FrontmatterParser();
        const bundlePath = this.docService.bundleRootPath;
        const report = await migrateBundle(fsAdapter, fmParser, bundlePath, { write, backup: write });
        return {
          content: [{ type: 'text', text: `Migration complete. Active write mode: ${write}.\nSuccess: ${report.success}\nMigrated files: ${report.filesMigrated}\nChecked files: ${report.filesChecked}\n${report.error ? 'Error: ' + report.error : ''}` }],
        };
      } catch (err: any) {
        mcpToolFailuresCounter.add(1);
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    });

    // Tool rebuild_indexes
    this.server.tool('rebuild_indexes', {}, async () => {
      mcpToolCallsCounter.add(1);
      try {
        const bundlePath = this.docService.bundleRootPath;
        const fsAdapter = new FileSystemAdapter();
        const fmParser = new FrontmatterParser();
        const indexService = new IndexService(fsAdapter, fmParser, bundlePath);
        
        // Root index + collections
        const subdirs = ['.'];
        for (const type of Object.values(OKFDocumentType)) {
            let plural = type.toLowerCase() + 's';
            if (plural === 'educations') plural = 'education';
            subdirs.push(plural);
        }
        
        const generated: string[] = [];
        for (const dir of subdirs) {
          const dirPath = path.join(bundlePath, dir);
          if (await fsAdapter.exists(dirPath)) {
            await indexService.generate(dirPath);
            generated.push(dir);
          }
        }
        
        return { content: [{ type: 'text', text: `Directory index.md listings generated successfully for: ${generated.join(', ')}.` }] };
      } catch (err: any) {
        mcpToolFailuresCounter.add(1);
        return { isError: true, content: [{ type: 'text', text: err.message }] };
      }
    });
  }
}
