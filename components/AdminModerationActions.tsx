'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2 } from 'lucide-react';

export default function AdminModerationActions({ postId }: { postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'APPROVE' | 'REJECT' | 'DELETE') => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-3 pt-2">
      <button
        onClick={() => handleAction('REJECT')}
        disabled={loading}
        className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs flex items-center space-x-1 border border-rose-500/30 transition-colors disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        <span>Reject Post</span>
      </button>

      <button
        onClick={() => handleAction('APPROVE')}
        disabled={loading}
        className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow transition-colors disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Approve & Publish</span>
      </button>
    </div>
  );
}
