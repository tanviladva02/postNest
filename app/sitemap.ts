import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Cache sitemap for 1 hour with ISR to prevent DB connection cold start timeouts for Googlebot
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.postnest.in').replace(/\/$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/best-blogging-platform`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/free-guest-post-site`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/backlink-creator-site`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/free-blog-upload-platform`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/top-blogging-platforms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Fast parallel fetch for dynamic routes
    const [posts, categories, companies] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
        take: 1000,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.category.findMany({
        select: { slug: true },
        take: 100,
      }),
      prisma.company.findMany({
        where: { isVerified: true },
        select: { slug: true, updatedAt: true },
        take: 100,
      }),
    ]);

    const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    const companyUrls: MetadataRoute.Sitemap = companies.map((comp) => ({
      url: `${baseUrl}/company/${comp.slug}`,
      lastModified: comp.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...postUrls, ...categoryUrls, ...companyUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
    // Return static routes immediately if database is unavailable
    return staticRoutes;
  }
}

