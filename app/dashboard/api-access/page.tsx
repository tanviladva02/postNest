'use client';

import { useState, useEffect } from 'react';
import { Key, Copy, Plus, Trash2, ShieldCheck, Lock, Code, CheckCircle2 } from 'lucide-react';

export default function ApiAccessPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [keyName, setKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/user/keys');
      const data = await res.json();
      if (data.keys) setKeys(data.keys);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/user/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName }),
      });

      const data = await res.json();
      if (data.apiKey) {
        setNewKeyRaw(data.apiKey);
        setKeyName('');
        fetchKeys();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Key className="w-6 h-6 text-rose-400" />
            <span>Developer API Keys</span>
          </h1>
          <p className="text-xs text-slate-400">Generate secure API keys to publish articles programmatically from your CMS or tools.</p>
        </div>

        <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          Premium API Feature
        </div>
      </div>

      {/* Security Architecture Box */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Server-Side Hashing & Security Model</span>
        </div>
        <p>
          API key secrets are generated as <code className="text-sky-400 bg-slate-950 px-1 py-0.5 rounded">pn_live_...</code> tokens and hashed using Secure SHA-256 before database storage. Private server environment credentials are never exposed to public browser JavaScript.
        </p>
      </div>

      {/* Raw Key Modal Box if created */}
      {newKeyRaw && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Save Your New API Key Now</span>
            <button onClick={() => setNewKeyRaw(null)} className="text-xs text-slate-400 hover:text-white">Dismiss</button>
          </div>
          <p className="text-xs text-slate-300">
            For security reasons, this key will <strong>NEVER</strong> be displayed again. Please copy and store it securely.
          </p>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={newKeyRaw}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-mono text-sm font-bold"
            />
            <button
              onClick={() => copyToClipboard(newKeyRaw)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Key Generation Form */}
      <form onSubmit={handleGenerateKey} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="Key Name (e.g. Production WordPress Automation)"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-lg whitespace-nowrap disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Generate API Key</span>
        </button>
      </form>

      {/* Keys Listing */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Active API Keys</h3>

        {keys.length === 0 ? (
          <p className="text-slate-400 text-xs italic">No API keys created yet.</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {keys.map((k) => (
              <div key={k.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{k.name}</p>
                  <p className="text-slate-400 font-mono">Prefix: {k.prefix}••••••••</p>
                </div>
                <div className="text-right text-slate-400">
                  <p>Created: {new Date(k.createdAt).toLocaleDateString()}</p>
                  <p className="text-[10px] text-slate-500">Last used: {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* cURL Documentation */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Code className="w-4 h-4 text-sky-400" />
          <span>cURL Integration Snippet</span>
        </h3>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sky-300 font-mono text-xs overflow-x-auto">
{`curl -X POST https://postnest.in/api/v1/posts \\
  -H "X-PostNest-Api-Key: pn_live_xxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Automated Blog Post Title",
    "excerpt": "Short meta summary...",
    "content": "<h2>Body Heading</h2><p>Article body content...</p>",
    "category": "Technology"
  }'`}
        </pre>
      </div>
    </div>
  );
}
