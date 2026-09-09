import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Building2, CheckCircle2, ExternalLink, Globe, ArrowLeft } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

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
      <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Company Header Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'}
            alt={company.companyName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 bg-slate-900"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{company.companyName}</h1>
              {company.isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-sky-400 text-xs font-semibold">
              {company.category || 'Technology & Business'}
            </span>
            <p className="text-slate-300 text-sm max-w-xl pt-1">{company.description}</p>
          </div>
        </div>

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-brand-500/20 transition-all shrink-0"
          >
            <Globe className="w-4 h-4" />
            <span>Official Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Company Published Articles Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Articles Published by {company.companyName} ({company.posts.length})</h2>

        {company.posts.length === 0 ? (
          <p className="text-slate-400 text-sm italic">No published articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {company.posts.map((post) => (
              <article key={post.id} className="glass-card rounded-xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-40 overflow-hidden">
                    <img
                      src={post.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-sky-400 uppercase font-semibold">{post.category.name}</span>
                    <h3 className="text-base font-bold text-white hover:text-brand-300 line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3">{post.excerpt}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 text-xs text-slate-400 flex justify-between border-t border-slate-800/60 mt-2">
                  <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  <Link href={`/blog/${post.slug}`} className="text-brand-400 font-semibold">
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
