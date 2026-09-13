'use client';

import Link from 'next/link';
import RazorpayCheckoutButton from './RazorpayCheckoutButton';
import { ArrowRight } from 'lucide-react';

interface PricingPlanCardActionProps {
  planId: string;
  planName: string;
  priceINR: number;
  ctaText: string;
  ctaLink: string;
  ctaStyle: string;
}

export default function PricingPlanCardAction({
  planId,
  planName,
  priceINR,
  ctaText,
  ctaLink,
  ctaStyle,
}: PricingPlanCardActionProps) {
  if (planId === 'STANDARD' || planId === 'PREMIUM') {
    return (
      <RazorpayCheckoutButton
        planName={planId as 'STANDARD' | 'PREMIUM'}
        displayName={planName}
        priceINR={priceINR}
        buttonText={ctaText}
        className={`w-full py-3.5 rounded-xl font-bold text-xs text-center flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] ${ctaStyle}`}
      />
    );
  }

  return (
    <Link
      href={ctaLink}
      className={`w-full py-3.5 rounded-xl font-bold text-xs text-center flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] ${ctaStyle}`}
    >
      <span>{ctaText}</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  );
}
