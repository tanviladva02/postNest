import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  UploadCloud,
  Building2,
  Key,
  CreditCard,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const activeSub = user.subscriptions[0];
  const planName = activeSub?.plan?.displayName || 'Early Bird Free';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0e1422] border-r border-slate-800/80 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User Profile Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <span className="inline-block text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-medium">
                {planName}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-400" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard/posts"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>My Posts</span>
            </Link>

            <Link
              href="/dashboard/create-post"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Create Post</span>
            </Link>

            <Link
              href="/dashboard/bulk-upload"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-indigo-400" />
              <span>Bulk Upload</span>
            </Link>

            <Link
              href="/dashboard/company"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Company Profile</span>
            </Link>

            <Link
              href="/dashboard/api-access"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Key className="w-4 h-4 text-rose-400" />
              <span>API Access</span>
            </Link>

            <Link
              href="/dashboard/subscription"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Subscription</span>
            </Link>
          </nav>
        </div>

        {/* Footer Admin Link & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
