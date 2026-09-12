import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminLayoutClient from '@/components/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}
