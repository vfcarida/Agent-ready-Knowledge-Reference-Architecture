import { useState } from 'react';
import { ServerCog, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export function SystemHealth() {
  const [validating, setValidating] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    setValidating(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/validate', { method: 'POST' });
      const data = await res.json();
      if (data.isError || !res.ok) {
        throw new Error(data.content?.[0]?.text || data.error);
      }
      setReport(JSON.parse(data.content[0].text));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setValidating(false);
    }
  };

  const handleMigrate = async () => {
    if (!confirm('Are you sure you want to migrate and backup your OKF bundle?')) return;
    setMigrating(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ write: true }),
      });
      const data = await res.json();
      if (data.isError || !res.ok) {
        throw new Error(data.content?.[0]?.text || data.error);
      }
      // Migration tool just returns text in our implementation, let's parse or show it
      setReport({ migrationText: data.content[0].text });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <ServerCog className="w-6 h-6 text-neon-blue" />
          System Health & Maintenance
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Validate your OKF career bundle against the latest schemas or migrate legacy formats.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-neon-blue">
          <h3 className="font-medium text-zinc-200 mb-2">Schema Validation</h3>
          <p className="text-sm text-zinc-400 mb-4 h-10">
            Check all Markdown files in the bundle for OCF Profile v1 compliance.
          </p>
          <button
            onClick={handleValidate}
            disabled={validating || migrating}
            className="w-full py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {validating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {validating ? 'Validating...' : 'Run Validation'}
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-neon-indigo">
          <h3 className="font-medium text-zinc-200 mb-2">Bundle Migration</h3>
          <p className="text-sm text-zinc-400 mb-4 h-10">
            Automatically upgrade legacy v0 OKF files to OCF Profile v1. Backups are created.
          </p>
          <button
            onClick={handleMigrate}
            disabled={validating || migrating}
            className="w-full py-2 bg-neon-indigo/20 hover:bg-neon-indigo/30 text-neon-indigo font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {migrating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {migrating ? 'Migrating...' : 'Run Migration'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <h3 className="text-red-400 font-medium">Operation Failed</h3>
          <pre className="text-red-400/80 text-xs mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {report && (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-medium text-zinc-200 border-b border-white/10 pb-2">Execution Report</h3>
          
          {report.migrationText ? (
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">
              {report.migrationText}
            </pre>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Valid Documents</div>
                  <div className="text-2xl text-emerald-400">{report.validCount ?? 0}</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Invalid Documents</div>
                  <div className="text-2xl text-red-400">{report.invalidCount ?? 0}</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Checked</div>
                  <div className="text-2xl text-zinc-300">{(report.validCount || 0) + (report.invalidCount || 0)}</div>
                </div>
              </div>

              {report.errors && report.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Validation Errors
                  </h4>
                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 max-h-60 overflow-y-auto">
                    <ul className="list-disc list-inside space-y-1">
                      {report.errors.map((err: string, i: number) => (
                        <li key={i} className="text-xs text-red-300/90">{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
