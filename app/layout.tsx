import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'PostNest.in - Modern Blog Publishing & Content Marketing Platform',
    template: '%s | PostNest.in',
  },
  description: 'Publish your stories, showcase your company products, build backlinks, and reach wider audiences on PostNest.in.',
  keywords: ['blog publishing', 'content marketing', 'company promotion', 'backlinks', 'SEO platform', 'PostNest'],
  authors: [{ name: 'PostNest Team' }],
  openGraph: {
    title: 'PostNest.in - Publish. Discover. Grow.',
    description: 'A modern platform where businesses, SEO professionals, bloggers, and startups publish high-quality articles.',
    url: 'https://postnest.in',
    siteName: 'PostNest.in',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
