import { useState, useEffect } from 'react';
import { ShieldCheck, Check, Clock, AlertTriangle } from 'lucide-react';

interface PendingApproval {
  token: string;
  toolName: string;
  expiresAt: number;
  metadata?: {
    jobUrl?: string;
    platform?: string;
    [key: string]: any;
  };
}

export function ApprovalQueue() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/automation/approvals');
      if (!res.ok) throw new Error('Failed to fetch approvals from server');
      const data = await res.json();
      
      if (data.isError) {
        throw new Error(data.content[0].text);
      }
      
      const content = JSON.parse(data.content[0].text);
      setApprovals(content.pending || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
    const interval = setInterval(fetchApprovals, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (token: string, jobUrl?: string) => {
    setProcessing(token);
    try {
      const res = await fetch('/api/automation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalToken: token, jobUrl, dryRun: false }),
      });
      const data = await res.json();
      if (data.isError || !res.ok) {
        alert('Failed to approve: ' + (data.content?.[0]?.text || data.error));
      } else {
        alert('Successfully approved and submitted!');
        await fetchApprovals();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-neon-purple" />
            Human-in-the-Loop Approval Queue
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Review and authorize sensitive operations blocked by the autonomy policy.
          </p>
        </div>
        <button
          onClick={fetchApprovals}
          className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg text-sm text-zinc-300 transition-colors"
        >
          Refresh Queue
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-medium">Failed to connect to Automation Server</h3>
            <p className="text-red-400/80 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && approvals.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-2 border-zinc-700/50">
          <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">No pending approvals</h3>
          <p className="text-zinc-500 mt-2 text-sm">
            All operations are currently running within their allowed autonomy levels.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {approvals.map((app) => (
          <div key={app.token} className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-neon-purple">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-neon-purple/20 text-neon-purple">
                  {app.toolName}
                </span>
                <span className="text-xs text-zinc-500">
                  Expires in {Math.max(0, Math.round((app.expiresAt - Date.now()) / 1000))}s
                </span>
              </div>
              <h3 className="text-zinc-200 font-medium truncate max-w-xl">
                {app.metadata?.jobUrl || 'Unknown Target'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Platform: {app.metadata?.platform || 'Unknown'} | Token ID: {app.token.slice(0, 8)}...
              </p>
            </div>
            <button
              onClick={() => handleApprove(app.token, app.metadata?.jobUrl)}
              disabled={processing === app.token}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {processing === app.token ? 'Approving...' : (
                <>
                  <Check className="w-4 h-4" />
                  Authorize Execution
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
