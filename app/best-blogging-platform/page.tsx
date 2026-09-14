import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SEO_LANDING_PAGES } from '@/lib/seo-landing-data';
import SeoLandingTemplate from '@/components/seo/SeoLandingTemplate';

export const revalidate = 60;

const pageData = SEO_LANDING_PAGES['best-blogging-platform'];

export function generateMetadata(): Metadata {
  return {
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    keywords: pageData.keywords,
    alternates: {
      canonical: pageData.canonicalUrl,
    },
    openGraph: {
      title: pageData.metaTitle,
      description: pageData.metaDescription,
      url: pageData.canonicalUrl,
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

export default async function BestBloggingPlatformPage() {
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

  return (
    <SeoLandingTemplate
      data={pageData}
      recentPosts={recentPosts}
      categories={categories}
    />
  );
}
