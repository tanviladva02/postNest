'use client';

import { useState, useEffect } from 'react';
import { Key, Copy, Plus, ShieldCheck, Lock, Code, CheckCircle2 } from 'lucide-react';

export default function ApiAccessPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [keyName, setKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [planName, setPlanName] = useState<string>('Free Starter');

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/user/keys');
      const data = await res.json();
      if (res.ok) {
        setHasAccess(true);
        if (data.keys) setKeys(data.keys);
      } else if (res.status === 403) {
        setHasAccess(false);
        if (data.planName) setPlanName(data.planName);
      }
    } catch (e) {
      console.error(e);
      setHasAccess(false);
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
      if (!res.ok) {
        alert(data.error || 'Failed generating API key');
        return;
      }
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

  if (hasAccess === false) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-orange-500/30 text-center space-y-6 bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="w-16 h-16 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto border border-orange-500/20 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              REST API Access is a Premium Feature
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Your current subscription (<span className="font-semibold text-orange-600 dark:text-orange-400">{planName}</span>) does not include headless REST API keys.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-left max-w-md mx-auto space-y-2 text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white">With Premium REST API Keys, you can:</p>
            <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-600 dark:text-slate-400">
              <li>Publish articles programmatically from CI/CD, Git, or Webhooks</li>
              <li>Integrate with WordPress, Ghost, Webflow, and custom backends</li>
              <li>Benefit from up to 10 posts/day programmatic publishing allowance</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/dashboard/subscription"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors shadow-md shadow-orange-500/20"
            >
              Upgrade to Premium Plan (₹599/mo)
            </a>
            <a
              href="/contact?subject=Custom+Enterprise+Plan+Inquiry"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition-colors"
            >
              Contact Us for Custom Plan
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Key className="w-6 h-6 text-orange-500" />
            <span>Developer API Keys</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate secure API keys to publish articles programmatically from your CMS or tools.</p>
        </div>

        <div className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">
          Premium API Feature
        </div>
      </div>

      {/* Security Architecture Box */}
      <div className="p-4 rounded-xl bg-orange-50 dark:bg-slate-900 border border-orange-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Server-Side Hashing & Security Model</span>
        </div>
        <p>
          API key secrets are generated as <code className="text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-950 px-1 py-0.5 rounded border border-orange-200 dark:border-slate-800">pn_live_...</code> tokens and hashed using Secure SHA-256 before database storage. Private server environment credentials are never exposed to public browser JavaScript.
        </p>
      </div>

      {/* Raw Key Modal Box if created */}
      {newKeyRaw && (
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Save Your New API Key Now</span>
            <button onClick={() => setNewKeyRaw(null)} className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">Dismiss</button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            For security reasons, this key will <strong>NEVER</strong> be displayed again. Please copy and store it securely.
          </p>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={newKeyRaw}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-sm font-bold"
            />
            <button
              onClick={() => copyToClipboard(newKeyRaw)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center space-x-1 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Key Generation Form */}
      <form onSubmit={handleGenerateKey} className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900/60">
        <input
          type="text"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="Key Name (e.g. Production WordPress Automation)"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-orange-500/20 whitespace-nowrap disabled:opacity-50 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate API Key</span>
        </button>
      </form>

      {/* Keys Listing */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900/60">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active API Keys</h3>

        {keys.length === 0 ? (
          <p className="text-slate-500 text-xs italic">No API keys created yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {keys.map((k) => (
              <div key={k.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{k.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono">Prefix: {k.prefix}••••••••</p>
                </div>
                <div className="text-right text-slate-500 dark:text-slate-400">
                  <p>Created: {new Date(k.createdAt).toLocaleDateString()}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Last used: {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* cURL Documentation */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900/60">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Code className="w-4 h-4 text-orange-500" />
          <span>cURL Integration Snippet</span>
        </h3>

        <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-orange-400 font-mono text-xs overflow-x-auto">
{`curl -X POST https://www.postnest.in/api/v1/posts \\
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
