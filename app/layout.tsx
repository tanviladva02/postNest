import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'PostNest.in - Publish Like a Pro | Modern Tech Blogging Platform',
    template: '%s | PostNest.in',
  },
  description: 'Where developers, startups, and tech writers publish like a pro. Distraction-free publishing, SEO-first distribution, and high-impact company blogs.',
  keywords: [
    'publish like a pro',
    'tech blogging platform',
    'developer blogging',
    'hashnode alternative',
    'startup stories',
    'SEO blog publishing',
    'company blog',
    'PostNest',
  ],
  authors: [{ name: 'PostNest Team' }],
  openGraph: {
    title: 'PostNest.in - Publish Like a Pro',
    description: 'The modern publication platform for developers, tech writers, and forward-thinking companies.',
    url: 'https://postnest.in',
    siteName: 'PostNest.in',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PostNest.in - Publish Like a Pro',
    description: 'The modern publication platform for developers, tech writers, and forward-thinking companies.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Anti-flash inline theme loader (defaults to Orange & White / light) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('postnest_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
