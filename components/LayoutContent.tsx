'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

interface LayoutContentProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export default function LayoutContent({ navbar, footer, children }: LayoutContentProps) {
  const pathname = usePathname();
  const isDashboardOrAdmin = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <>
      {!isDashboardOrAdmin && navbar}
      <main className="flex-grow w-full min-w-0">{children}</main>
      {!isDashboardOrAdmin && footer}
    </>
  );
}

