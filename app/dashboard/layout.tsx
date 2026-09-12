import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardLayoutClient from '@/components/DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const isTestAccount = user.email?.toLowerCase() === 'tanviladva01@gmail.com';
  const activeSub = user.subscriptions[0];
  const planName = isTestAccount
    ? 'Unlimited Testing Tier'
    : (activeSub?.plan?.displayName || 'Early Bird Free');

  return (
    <DashboardLayoutClient user={user} planName={planName}>
      {children}
    </DashboardLayoutClient>
  );
}

