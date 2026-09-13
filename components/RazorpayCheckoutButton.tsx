'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

interface RazorpayCheckoutButtonProps {
  planName: 'STANDARD' | 'PREMIUM';
  displayName: string;
  priceINR: number;
  className?: string;
  buttonText?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayCheckoutButton({
  planName,
  displayName,
  priceINR,
  className = '',
  buttonText,
}: RazorpayCheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay payment gateway SDK. Please check your internet connection.');
      }

      // 2. Create Order via Backend API
      const res = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/pricing`);
          return;
        }
        throw new Error(orderData.error || 'Could not initiate payment order.');
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PostNest Publishing',
        description: `Upgrade to ${displayName} Plan`,
        image: '/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user?.name || '',
          email: orderData.user?.email || '',
        },
        theme: {
          color: '#f97316', // PostNest Orange
        },
        handler: async function (response: any) {
          setLoading(true);
          try {
            // 4. Verify Payment Signature
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: orderData.planId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            setSuccess(true);
            setTimeout(() => {
              router.push('/dashboard/subscription?success=upgraded');
              router.refresh();
            }, 1200);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold text-center flex items-center justify-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Payment Successful! Redirecting...</span>
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading || success}
        className={
          className ||
          'w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50'
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        <span>
          {loading
            ? 'Processing Payment...'
            : buttonText || `Upgrade to ${displayName} (₹${priceINR})`}
        </span>
        {!loading && !success && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
