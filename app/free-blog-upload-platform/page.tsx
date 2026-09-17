import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/site';
import { SEO_LANDING_PAGES } from '@/lib/seo-landing-data';
import SeoLandingTemplate from '@/components/seo/SeoLandingTemplate';

export const revalidate = 60;

const pageData = SEO_LANDING_PAGES['free-blog-upload-platform'];

export function generateMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/free-blog-upload-platform`;

  return {
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    keywords: pageData.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageData.metaTitle,
      description: pageData.metaDescription,
      url: canonicalUrl,
      type: 'website',
      siteName: 'PostNest',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.metaTitle,
      description: pageData.metaDescription,
    },
  };
}

export default async function FreeBlogUploadPlatformPage() {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/free-blog-upload-platform`;

  let recentPosts: any[] = [];
  let categories: any[] = [];

  try {
    const [postsData, categoriesData] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          createdAt: true,
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { name: true, image: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: 6,
      }),
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
        take: 8,
        orderBy: { name: 'asc' },
      }),
    ]);
    recentPosts = postsData;
    categories = categoriesData;
  } catch (error) {
    console.error('Error loading live data for SEO landing page:', error);
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Free Blog Upload Platform',
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SeoLandingTemplate
        data={{
          ...pageData,
          canonicalUrl,
        }}
        recentPosts={recentPosts}
        categories={categories}
      />
    </>
  );
}
