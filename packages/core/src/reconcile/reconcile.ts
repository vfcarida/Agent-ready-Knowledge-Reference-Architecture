import fs from 'node:fs';
import path from 'node:path';
import type { AkcpConfig } from '../config/akcp-config-schema.js';

export interface ReconcileOptions {
  dryRun: boolean;
}

export interface ReconcileResult {
  status: 'in-sync' | 'out-of-sync' | 'error';
  differences: string[];
  message: string;
}

/**
 * Compares the desired state (akcp.yaml config) with the current state (filesystem).
 * For now, only supports dry-run (observability). Destructive changes will be implemented later.
 */
export async function reconcile(config: AkcpConfig, options: ReconcileOptions): Promise<ReconcileResult> {
  const differences: string[] = [];
  const fixesPerformed: string[] = [];

  // 1. Check sources existence
  const missingSources: string[] = [];
  for (const source of config.compile.sources) {
    if (source.path) {
      const sourcePath = path.resolve(source.path);
      if (!fs.existsSync(sourcePath)) {
        if (options.dryRun) {
          differences.push(`Source missing: Directory '${source.path}' does not exist.`);
        } else {
          missingSources.push(sourcePath);
        }
      }
    }
  }

  // 2. Check target output
  const missingTargets: typeof config.compile.targets = [];
  if (config.compile.targets) {
    for (const targetConf of config.compile.targets) {
      const targetPath = path.resolve(targetConf.out);
      if (!fs.existsSync(targetPath)) {
        if (options.dryRun) {
          differences.push(`Target missing: Compiled output '${targetConf.out}' does not exist.`);
        } else {
          missingTargets.push(targetConf);
        }
      }
    }
  }

  // 3. Dry run semantics
  if (options.dryRun) {
    if (differences.length === 0) {
      return {
        status: 'in-sync',
        differences,
        message: 'Dry run: System is in-sync with desired state.'
      };
    } else {
      return {
        status: 'out-of-sync',
        differences,
        message: 'Dry run: System is out-of-sync. Re-compilation or environment fixes required.'
      };
    }
  }

  // 4. Mutation logic (dryRun = false)
  // Create missing source directories
  for (const sourcePath of missingSources) {
    fs.mkdirSync(sourcePath, { recursive: true });
    fixesPerformed.push(`Created missing source directory: '${path.relative(process.cwd(), sourcePath)}'`);
  }

  // Compile missing targets
  if (missingTargets.length > 0) {
    const { buildKnowledgeIR } = await import('../ir/build-ir.js');
    const { IrJsonTarget } = await import('../targets/ir-json.js');
    const { OkfBundleTarget } = await import('../targets/okf-bundle.js');
    const { OpenWikiDocsTarget } = await import('../targets/openwiki-docs.js');
    const { AgentsMdTarget } = await import('../targets/agents-md.js');
    const { McpResourcesManifestTarget } = await import('../targets/mcp-resources-manifest.js');
    const { PolicyBundleTarget } = await import('../targets/policy-bundle.js');
    const { EvalDatasetTarget } = await import('../targets/eval-dataset.js');
    const { GraphJsonTarget } = await import('../targets/graph-json.js');
    const { ProvenanceManifestBuilder } = await import('../provenance/build-manifest.js');

    const bundleRoot = path.resolve('.');
    const ir = await buildKnowledgeIR(bundleRoot, { sources: config.compile.sources });
    const manifestBuilder = new ProvenanceManifestBuilder();
    
    const targetInstances: Record<string, any> = {
      'ir-json': new IrJsonTarget(),
      'okf-bundle': new OkfBundleTarget(),
      'openwiki-docs': new OpenWikiDocsTarget(),
      'agents-md': new AgentsMdTarget(),
      'mcp-resources-manifest': new McpResourcesManifestTarget(),
      'policy-bundle': new PolicyBundleTarget(),
      'eval-dataset': new EvalDatasetTarget(),
      'graph-json': new GraphJsonTarget()
    };

    for (const targetConf of missingTargets) {
      const targetImpl = targetInstances[targetConf.type];
      if (targetImpl) {
        const outPath = path.resolve(targetConf.out);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        const output = await targetImpl.compile(ir, targetConf);
        manifestBuilder.addOutput(output);
        fixesPerformed.push(`Compiled missing target: '${targetConf.type}' -> '${targetConf.out}'`);
      }
    }

    // Write build manifest
    await manifestBuilder.writeManifest(ir, 'dist/akcp-manifest.json', 'none', '0.1.0');
  }

  if (fixesPerformed.length === 0) {
    return {
      status: 'in-sync',
      differences: [],
      message: 'System is already in-sync. No fixes needed.'
    };
  } else {
    return {
      status: 'in-sync',
      differences: [],
      message: `Reconciliation complete. Fixed issues:\n${fixesPerformed.map(f => `  - ${f}`).join('\n')}`
    };
  }
}
