'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Star,
  Bug,
  Lightbulb,
  AlertTriangle,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface FloatingFeedbackWidgetProps {
  user?: any;
}

const CATEGORIES = [
  { id: 'REVIEW', label: 'Review', icon: Star, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  { id: 'SUGGESTION', label: 'Suggestion', icon: Lightbulb, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { id: 'BUG', label: 'Bug', icon: Bug, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
  { id: 'ISSUE', label: 'Issue', icon: AlertTriangle, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  { id: 'FEEDBACK', label: 'Feedback', icon: MessageSquare, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
];

export default function FloatingFeedbackWidget({ user }: FloatingFeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<string>('REVIEW');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Smooth Dragging Position State
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary pointer button
    if (e.button !== 0) return;
    
    isDragging.current = true;
    hasMoved.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    elementStartPos.current = { x: rect.left, y: rect.top };

    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMoved.current = true;
    }

    const newX = Math.max(16, Math.min(window.innerWidth - 140, elementStartPos.current.x + dx));
    const newY = Math.max(16, Math.min(window.innerHeight - 60, elementStartPos.current.y + dy));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    // If user clicked without dragging, open/close popup
    if (!hasMoved.current) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message || message.trim().length < 5) {
      setError('Please enter at least 5 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          rating: type === 'REVIEW' || type === 'FEEDBACK' ? rating : null,
          subject: subject.trim() || null,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback.');
      }

      setSuccess(true);
      setMessage('');
      setSubject('');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setMessage('');
    setSubject('');
  };

  return (
    <>
      {/* Draggable Floating Trigger Button */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={
          position
            ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
            : undefined
        }
        className={`fixed ${
          position ? '' : 'bottom-6 right-6'
        } z-40 touch-none select-none cursor-grab active:cursor-grabbing transition-shadow duration-200`}
      >
        <div className="relative group">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-full bg-slate-950 dark:bg-orange-600 text-white font-bold text-xs shadow-2xl border border-slate-800 dark:border-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200">
            <Sparkles className="w-4 h-4 text-orange-400 dark:text-amber-200 animate-pulse shrink-0" />
            <span className="tracking-wide font-semibold">Feedback</span>
          </div>
          
          {/* Subtle tooltip indicator */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-900 text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
            Drag anywhere or click
          </span>
        </div>
      </div>

      {/* Feedback Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0e1422] max-w-md w-full p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Feedback</h3>
                  <p className="text-[11px] text-slate-500">We appreciate your thoughts and bug reports!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="py-6 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Thank You!</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                    Your feedback has been received by our product team.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Submit Another
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-500 shadow-md shadow-orange-600/20 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Pills */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = type === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setType(cat.id)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? `${cat.color} font-bold shadow-xs scale-105`
                              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating if Review / Feedback */}
                {(type === 'REVIEW' || type === 'FEEDBACK') && (
                  <div className="space-y-1 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                        {hoverRating || rating}/5
                      </span>
                    </div>
                  </div>
                )}

                {/* Subject Title */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Subject <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Short summary..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Message <span className="text-orange-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">{message.length}/1000</span>
                  </div>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    required
                    placeholder="Share your thoughts, issue details, or suggestions..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-500/10 p-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30">
                    {error}
                  </p>
                )}

                {/* High Contrast Solid Modern SaaS Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="w-full py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-orange-600/20 transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
