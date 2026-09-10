import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  UploadCloud,
  Building2,
  Key,
  CreditCard,
  LogOut,
  Shield,
  Home,
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

  const isTestAccount = user.email?.toLowerCase() === 'tanviladva01@gmail.com';
  const activeSub = user.subscriptions[0];
  const planName = isTestAccount
    ? 'Unlimited Testing Tier'
    : (activeSub?.plan?.displayName || 'Early Bird Free');

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row overflow-hidden transition-colors">
      {/* Fixed Height Sidebar Navigation */}
      <aside className="w-full md:w-64 h-full md:h-screen bg-white dark:bg-[#0e1422] border-r border-slate-200 dark:border-slate-800/80 p-5 lg:p-6 flex flex-col justify-between shrink-0 overflow-hidden transition-colors">
        <div className="space-y-5 flex-1 flex flex-col min-h-0">
          {/* Brand Logo & Back to Home */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <Link href="/" className="flex flex-col items-start group">
              <Image
                src="/logo.png"
                alt="PostNest"
                width={140}
                height={36}
                className="h-7 w-auto object-contain dark:hidden"
                priority
              />
              <Image
                src="/logo-dark.png"
                alt="PostNest"
                width={140}
                height={36}
                className="h-7 w-auto object-contain hidden dark:block"
                priority
              />
              <span className="text-[8px] font-extrabold tracking-[0.2em] uppercase bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent mt-0.5">
                Publish like a pro
              </span>
            </Link>
            <ThemeToggle />
          </div>

          {/* User Profile Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <span className="inline-block text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded font-medium">
                {planName}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-orange-500" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard/posts"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>My Posts</span>
            </Link>

            <Link
              href="/dashboard/create-post"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-orange-500" />
              <span>Create Post</span>
            </Link>

            <Link
              href="/dashboard/bulk-upload"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-orange-500" />
              <span>Bulk Upload</span>
            </Link>

            <Link
              href="/dashboard/company"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Building2 className="w-4 h-4 text-orange-500" />
              <span>Company Profile</span>
            </Link>

            <Link
              href="/dashboard/api-access"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Key className="w-4 h-4 text-orange-500" />
              <span>API Access</span>
            </Link>

            <Link
              href="/dashboard/subscription"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-orange-500" />
              <span>Subscription</span>
            </Link>
          </nav>
        </div>

        {/* Footer Admin Link & Logout */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 text-xs font-medium transition-colors"
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
