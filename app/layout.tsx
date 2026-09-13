import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import LayoutContent from '@/components/LayoutContent';

const gaId = process.env.NEXT_PUBLIC_GA_ID || '';

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

        {/* Google Analytics (GA4) Tracking Script */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Anti-flash inline theme loader */}
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
          <LayoutContent navbar={<Navbar />} footer={<Footer />}>
            {children}
          </LayoutContent>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

