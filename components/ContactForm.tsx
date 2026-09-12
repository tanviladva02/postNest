'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2, AlertTriangle, Phone, Mail, User, FileText, MessageSquare } from 'lucide-react';

export default function ContactForm() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState(
    initialSubject.toLowerCase().includes('custom')
      ? 'Hi PostNest Team, I would like to inquire about a Custom Enterprise Plan for our organization. Here are our anticipated requirements:\n- Target daily posts volume: \n- Target monthly posts volume: \n- Team seats / API access requirements: '
      : ''
  );

  useEffect(() => {
    const qSubject = searchParams.get('subject');
    if (qSubject) {
      setSubject(qSubject);
      if (qSubject.toLowerCase().includes('custom') && !message) {
        setMessage(
          'Hi PostNest Team, I would like to inquire about a Custom Enterprise Plan for our organization. Here are our anticipated requirements:\n- Target daily posts volume: \n- Target monthly posts volume: \n- Team seats / API access requirements: '
        );
      }
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateClientSide = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      errors.phone = 'Phone number is required.';
    } else {
      const allowedPhoneChars = /^\+?[0-9\s\-().]+$/;
      if (!allowedPhoneChars.test(trimmedPhone)) {
        errors.phone = 'Phone number contains invalid characters.';
      } else {
        const phoneDigits = trimmedPhone.replace(/\D/g, '');
        const hasCountryCode = trimmedPhone.startsWith('+');

        if (hasCountryCode) {
          if (phoneDigits.length !== 12) {
            errors.phone = `Phone with country code must contain 12 digits (e.g. +91 98765 43210). Current: ${phoneDigits.length} digits.`;
          }
        } else {
          if (phoneDigits.length !== 10 && phoneDigits.length !== 12) {
            errors.phone = `Phone number must be 10 digits (or 12 digits with country code, e.g. 9876543210). Current: ${phoneDigits.length} digits.`;
          }
        }
      }
    }

    if (!subject.trim()) {
      errors.subject = 'Subject is required.';
    } else if (subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters.';
    }

    if (!message.trim()) {
      errors.message = 'Message is required.';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setFieldErrors({});

    if (!validateClientSide()) {
      setStatus({ type: 'error', text: 'Please complete all required fields with valid details.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        throw new Error(data.error || 'Failed to submit contact message.');
      }

      setStatus({ type: 'success', text: data.message });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setFieldErrors({});
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-6 shadow-sm">
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Send us a Message
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Please fill out the form below. All fields are required.
        </p>
      </div>

      {status && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-medium border flex items-start space-x-2.5 transition-all ${
            status.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{status.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Full Name <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Jane Doe"
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs focus:outline-none transition-colors ${
              fieldErrors.name
                ? 'border-rose-400 focus:border-rose-500 dark:border-rose-500/50'
                : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
            }`}
          />
          {fieldErrors.name && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="jane@company.com"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs focus:outline-none transition-colors ${
                fieldErrors.email
                  ? 'border-rose-400 focus:border-rose-500 dark:border-rose-500/50'
                  : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone Number <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
              }}
              placeholder="+91 98765 43210 or 9876543210"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs focus:outline-none transition-colors ${
                fieldErrors.phone
                  ? 'border-rose-400 focus:border-rose-500 dark:border-rose-500/50'
                  : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
              }`}
            />
            {fieldErrors.phone && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{fieldErrors.phone}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Subject <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (fieldErrors.subject) setFieldErrors((prev) => ({ ...prev, subject: '' }));
            }}
            placeholder="Brief topic summary"
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs focus:outline-none transition-colors ${
              fieldErrors.subject
                ? 'border-rose-400 focus:border-rose-500 dark:border-rose-500/50'
                : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
            }`}
          />
          {fieldErrors.subject && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{fieldErrors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Your Message <span className="text-rose-500">*</span></span>
          </label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
            }}
            placeholder="Provide as much context as possible..."
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs focus:outline-none transition-colors leading-relaxed ${
              fieldErrors.message
                ? 'border-rose-400 focus:border-rose-500 dark:border-rose-500/50'
                : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
            }`}
          />
          {fieldErrors.message && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{fieldErrors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? 'Submitting Message...' : 'Submit Message'}</span>
        </button>
      </form>
    </div>
  );
}
