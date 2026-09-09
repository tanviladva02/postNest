import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  // Fallback: If DB table is empty, auto-populate default categories
  if (categories.length === 0) {
    const defaultCategories = [
      { name: 'Technology', slug: 'technology', description: 'Latest news, tech innovations, and software trends.', icon: 'Cpu' },
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO tips, growth strategies, and content marketing.', icon: 'TrendingUp' },
      { name: 'Business', slug: 'business', description: 'Startup growth, entrepreneurship, and management.', icon: 'Briefcase' },
      { name: 'Finance', slug: 'finance', description: 'Fintech, investments, crypto, and wealth management.', icon: 'DollarSign' },
      { name: 'Health & Lifestyle', slug: 'health-lifestyle', description: 'Wellness, productivity, and modern living.', icon: 'Heart' },
      { name: 'AI & Tools', slug: 'ai-tools', description: 'Artificial intelligence software, reviews, and workflows.', icon: 'Sparkles' },
    ];

    for (const cat of defaultCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
    }

    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  return NextResponse.json({ categories });
}
