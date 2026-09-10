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
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && navbar}
      <main className="flex-grow">{children}</main>
      {!isDashboard && footer}
    </>
  );
}
