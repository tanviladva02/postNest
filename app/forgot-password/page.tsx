'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Feather,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setSuccessMessage('A 6-digit verification code has been sent to your email.');
      setResendCooldown(60);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      setResetToken(data.resetToken);
      setSuccessMessage('');
      setStep('NEW_PASSWORD');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          email: email.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200 dark:bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-blue-500' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 glass-panel p-7 sm:p-9 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900/80 relative overflow-hidden transition-all">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 mx-auto flex items-center justify-center shadow-lg shadow-orange-500/25">
            {step === 'SUCCESS' ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : step === 'NEW_PASSWORD' ? (
              <Lock className="w-6 h-6 text-white" />
            ) : step === 'OTP' ? (
              <KeyRound className="w-6 h-6 text-white" />
            ) : (
              <Feather className="w-6 h-6 text-white" />
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {step === 'EMAIL' && 'Reset Your Password'}
            {step === 'OTP' && 'Verify Security Code'}
            {step === 'NEW_PASSWORD' && 'Create New Password'}
            {step === 'SUCCESS' && 'Password Updated!'}
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {step === 'EMAIL' && 'Enter your account email to receive a secure 6-digit OTP.'}
            {step === 'OTP' && `We sent a one-time verification code to ${email}.`}
            {step === 'NEW_PASSWORD' && 'Choose a strong, secure password for your PostNest account.'}
            {step === 'SUCCESS' && 'Your credentials have been securely reset. You can now log in.'}
          </p>
        </div>

        {/* Step Progression Indicators */}
        {step !== 'SUCCESS' && (
          <div className="flex items-center justify-center space-x-2 pt-1 pb-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'EMAIL'
                  ? 'w-8 bg-orange-500'
                  : 'w-4 bg-orange-500/40'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'OTP'
                  ? 'w-8 bg-orange-500'
                  : step === 'NEW_PASSWORD'
                  ? 'w-4 bg-orange-500/40'
                  : 'w-4 bg-slate-200 dark:bg-slate-800'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'NEW_PASSWORD'
                  ? 'w-8 bg-orange-500'
                  : 'w-4 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          </div>
        )}

        {/* Error Notification Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message Alert */}
        {successMessage && !error && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: EMAIL INPUT ================= */}
        {step === 'EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{loading ? 'Sending Code...' : 'Send Verification Code (OTP)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ================= STEP 2: OTP VERIFICATION ================= */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('EMAIL');
                  }}
                  className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                >
                  Change Email
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center tracking-[0.4em] font-extrabold text-base focus:outline-none focus:border-orange-500 transition-colors"
                  required
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center pt-1">
                ⏱️ Code expires in 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{loading ? 'Verifying Code...' : 'Verify & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Resend Code Action */}
            <div className="text-center pt-1">
              {resendCooldown > 0 ? (
                <p className="text-xs text-slate-400 flex items-center justify-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Resend available in {resendCooldown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={loading}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Verification Code</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* ================= STEP 3: NEW PASSWORD ================= */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Strength:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{strength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-full flex-1 rounded-full transition-colors ${
                          level <= strength.score ? strength.color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmPassword && (
                <p
                  className={`text-[11px] font-semibold ${
                    newPassword === confirmPassword ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Saving Password...' : 'Save New Password & Sign In'}</span>
            </button>
          </form>
        )}

        {/* ================= STEP 4: SUCCESS CONFIRMATION ================= */}
        {step === 'SUCCESS' && (
          <div className="space-y-5 text-center pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed space-y-1">
              <p className="font-bold text-sm">Security Verification Complete</p>
              <p>Your password has been reset successfully. You can now access your PostNest dashboard with your new credentials.</p>
            </div>

            <Link
              href="/login"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01]"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <Link
            href="/login"
            className="inline-flex items-center space-x-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>

          <Link
            href="/register"
            className="hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors"
          >
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
