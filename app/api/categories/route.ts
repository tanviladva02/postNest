import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const defaultCategories = [
    { name: 'Technology', slug: 'technology', description: 'Latest news, tech innovations, and software trends.', icon: 'Cpu' },
    { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO tips, growth strategies, and content marketing.', icon: 'TrendingUp' },
    { name: 'Business', slug: 'business', description: 'Startup growth, entrepreneurship, and management.', icon: 'Briefcase' },
    { name: 'Finance', slug: 'finance', description: 'Fintech, investments, crypto, and wealth management.', icon: 'DollarSign' },
    { name: 'Health & Lifestyle', slug: 'health-lifestyle', description: 'Wellness, productivity, and modern living.', icon: 'Heart' },
    { name: 'AI & Tools', slug: 'ai-tools', description: 'Artificial intelligence software, reviews, and workflows.', icon: 'Sparkles' },
    { name: 'Jobs & Opportunities', slug: 'jobs-opportunities', description: 'Career guidance, tech hiring, remote work, and job opportunities.', icon: 'Briefcase' },
  ];

  // Auto-upsert default categories to guarantee all default categories exist in DB
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon },
      create: cat,
    });
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return NextResponse.json({ categories });
}
