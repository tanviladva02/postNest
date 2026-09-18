import type { Metadata } from 'next';
import Script from 'next/script';
import { getSiteUrl } from '@/lib/site';
// import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import LayoutContent from '@/components/LayoutContent';

const gaId = process.env.NEXT_PUBLIC_GA_ID || '';
const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1496798572797187';
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PostNest Best Free Blogging Platform & Guest Posting Submission Site',
    template: '%s | PostNest',
  },
  description:
    'PostNest is the #1 best blogging platform & free guest posting site for developers, tech teams, and writers. Enjoy free blog upload with zero paywalls & 100% forever free platform access.',
  keywords: [
    'PostNest',
    'postnest',
    'post nest',
    'PostNest.in',
    'guest posting sites free',
    'best blogging platform',
    'free guest post sites',
    'guest posting submission sites',
    'free blog upload',
    'free blog upload platform',
    'forever free platform',
    'publish like a pro',
    'tech blogging platform',
    'developer blogging',
    'guest blogging platform',
    'SEO blog publishing',
    'company blog',
    'developer guest post',
    'backlinks for startups',
  ],
  authors: [{ name: 'PostNest Team', url: siteUrl }],
  creator: 'PostNest',
  publisher: 'PostNest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'PostNest Best Free Blogging Platform & Guest Posting Submission Site',
    description:
      'The #1 free guest post site and blogging platform for developers, tech writers, and companies. Free blog upload & automated Google SEO ranking.',
    url: siteUrl,
    siteName: 'PostNest',
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'PostNest — Best Free Blogging Platform & Guest Posting Site',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PostNest Best Free Blogging Platform & Guest Posting Submission Site',
    description:
      'Where developers & tech teams publish like a pro. Free guest posting sites, free blog upload, and automated SEO distribution.',
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'e41f8b61f9225429',
  },
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1496798572797187',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global Schema.org Structured Data for Google Entity Resolution
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'PostNest',
    alternateName: ['PostNest.in', 'postnest', 'Post Nest', 'postnest.in'],
    url: siteUrl,
    description:
      'PostNest is where developers, engineering teams, and startups publish like a pro. Distraction-free publishing, SEO-first backlink distribution, and verified company hubs.',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'PostNest',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/#explore`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'PostNest',
    alternateName: ['PostNest.in', 'Post Nest'],
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      caption: 'PostNest Logo',
    },
    image: `${siteUrl}/logo.png`,
    description:
      'Modern tech publishing and guest posting platform for developers, tech teams, and startups.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91 70411 67089',
      contactType: 'customer support',
      email: 'support@postnest.in',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Home',
        url: `${siteUrl}`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Services',
        url: `${siteUrl}/services`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'Pricing',
        url: `${siteUrl}/pricing`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'About',
        url: `${siteUrl}/about`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'Contact',
        url: `${siteUrl}/contact`,
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Schema.org JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />

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

        {/* Google AdSense Auto-Ads Script & Account Verification Meta Tag */}
        {adSenseId && (
          <>
            <meta name="google-adsense-account" content={adSenseId} />
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
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
        {/* <Analytics /> */}
      </body>
    </html>
  );
}


