import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Settings, Save, Shield } from 'lucide-react';
import PlanLimitEditorForm from '@/components/PlanLimitEditorForm';

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const plans = await prisma.plan.findMany({
    orderBy: { priceINR: 'asc' },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Settings className="w-6 h-6 text-orange-400" />
            <span>Configurable Subscription & Quota Settings</span>
          </h1>
          <p className="text-xs text-slate-400">Dynamically update daily/monthly publishing limits per plan without code deployments.</p>
        </div>
        <Link href="/admin" className="text-xs text-orange-400 hover:underline">← Back to Admin Panel</Link>
      </div>

      <PlanLimitEditorForm initialPlans={plans} />
    </div>
  );
}
