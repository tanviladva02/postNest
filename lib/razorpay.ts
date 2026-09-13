import Razorpay from 'razorpay';
import crypto from 'crypto';

export const getRazorpayKeyId = (): string => {
  return process.env.RAZORPAY_API_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
};

export const getRazorpayKeySecret = (): string => {
  return process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
};

/**
 * Returns a configured Razorpay instance for server-side order generation and verification
 */
export function getRazorpayInstance(): Razorpay {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Verifies the authenticity of a Razorpay payment signature (HMAC-SHA256)
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = getRazorpayKeySecret();
  const body = `${orderId}|${paymentId}`;
  
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
