import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/site';
import { Building2, CheckCircle2, ExternalLink, Globe, ArrowLeft } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    select: { companyName: true, slug: true, description: true, logo: true },
  });

  if (!company) {
    return {
      title: 'Company Not Found | PostNest',
    };
  }

  const baseUrl = getSiteUrl();

  return {
    title: `${company.companyName} Tech Blog & Hub | PostNest`,
    description:
      company.description ||
      `Read verified engineering articles, product guides, and case studies from ${company.companyName} on PostNest.`,
    alternates: {
      canonical: `${baseUrl}/company/${company.slug}`,
    },
    openGraph: {
      title: `${company.companyName} — Engineering Stories | PostNest`,
      description:
        company.description ||
        `Read verified engineering articles from ${company.companyName} on PostNest.`,
      url: `${baseUrl}/company/${company.slug}`,
      images: company.logo ? [{ url: company.logo }] : [`${baseUrl}/logo.png`],
    },
  };
}

export const revalidate = 60; // 60s cache revalidation


export default async function CompanyProfilePage({ params }: Props) {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!company) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link href="/" className="text-xs text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-white flex items-center space-x-1 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Company Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white dark:bg-slate-900/60">
        <div className="flex items-center space-x-5">
          <img
            src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'}
            alt={company.companyName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{company.companyName}</h1>
              {company.isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 text-xs font-semibold">
              {company.category || 'Technology & Business'}
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl pt-1 leading-relaxed">{company.description}</p>
          </div>
        </div>

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm flex items-center space-x-2 shadow-md transition-all shrink-0"
          >
            <Globe className="w-4 h-4" />
            <span>Official Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Company Published Articles Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Articles Published by {company.companyName} ({company.posts.length})
        </h2>

        {company.posts.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No published articles yet from this company.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {company.posts.map((post) => (
              <article key={post.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800 group">
                <div>
                  <div className="h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={post.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-orange-600 dark:text-orange-400 uppercase font-semibold">{post.category.name}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 flex justify-between border-t border-slate-100 dark:border-slate-800/60 mt-2">
                  <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  <Link href={`/blog/${post.slug}`} className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
