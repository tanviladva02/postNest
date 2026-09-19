import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostNest.in database...');

  // 1. Seed Subscription Plans
  const plans = [
    {
      name: 'EARLY_BIRD',
      displayName: 'Early Bird Free Plan',
      priceINR: 0,
      monthlyPostLimit: 30,
      dailyPostLimit: 2,
      draftLimit: 10,
      hasScheduling: false,
      hasBulkUpload: false,
      hasApiAccess: false,
      description: 'Free: Up to 2 posts per day, with a maximum of 30 posts per month (First 100 Users Special).',
    },
    {
      name: 'FREE',
      displayName: 'Free Starter Plan',
      priceINR: 0,
      monthlyPostLimit: 15,
      dailyPostLimit: 1,
      draftLimit: 5,
      hasScheduling: false,
      hasBulkUpload: false,
      hasApiAccess: false,
      description: 'Free: Up to 1 post per day, with a maximum of 15 posts per month.',
    },
    {
      name: 'STANDARD',
      displayName: 'Standard Creator Plan',
      priceINR: 299,
      monthlyPostLimit: 60,
      dailyPostLimit: 5,
      draftLimit: 50,
      hasScheduling: true,
      hasBulkUpload: true,
      hasApiAccess: false,
      description: 'Standard: Up to 5 posts per day, with a maximum of 60 posts per month.',
    },
    {
      name: 'PREMIUM',
      displayName: 'Premium Growth Plan',
      priceINR: 599,
      monthlyPostLimit: 100,
      dailyPostLimit: 10,
      draftLimit: 0, // 0 means unlimited
      hasScheduling: true,
      hasBulkUpload: true,
      hasApiAccess: true,
      description: 'Premium: Up to 10 posts per day, with a maximum of 100 posts per month.',
    },
    {
      name: 'CUSTOM',
      displayName: 'Custom Enterprise Plan',
      priceINR: 0,
      monthlyPostLimit: 0, // 0 means custom/unlimited
      dailyPostLimit: 0,
      draftLimit: 0,
      hasScheduling: true,
      hasBulkUpload: true,
      hasApiAccess: true,
      description: 'Custom: Tailored high-volume daily & monthly posts for teams & agencies.',
    },
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }
  console.log('Plans created.');

  // 2. Seed Categories
  const categories = [
    { name: 'Technology', slug: 'technology', description: 'Latest news, tech innovations, and software trends.', icon: 'Cpu' },
    { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO tips, growth strategies, and content marketing.', icon: 'TrendingUp' },
    { name: 'Business', slug: 'business', description: 'Startup growth, entrepreneurship, and management.', icon: 'Briefcase' },
    { name: 'Finance', slug: 'finance', description: 'Fintech, investments, crypto, and wealth management.', icon: 'DollarSign' },
    { name: 'Health & Lifestyle', slug: 'health-lifestyle', description: 'Wellness, productivity, and modern living.', icon: 'Heart' },
    { name: 'AI & Tools', slug: 'ai-tools', description: 'Artificial intelligence software, reviews, and workflows.', icon: 'Sparkles' },
    { name: 'Jobs & Opportunities', slug: 'jobs-opportunities', description: 'Career guidance, tech hiring, remote work, and job opportunities.', icon: 'Briefcase' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('Categories created.');

  // 3. Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@postnest.in' },
    update: {},
    create: {
      name: 'PostNest Admin',
      email: 'admin@postnest.in',
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Platform Lead & Quality Inspector at PostNest.in',
    },
  });

  const creatorUser = await prisma.user.upsert({
    where: { email: 'author@nexusai.io' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'author@nexusai.io',
      username: 'rahulsharma',
      passwordHash: userPassword,
      role: 'USER',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Tech lead at Nexus AI. Writing about developer tools and machine learning.',
    },
  });

  const premiumPlan = await prisma.plan.findUnique({ where: { name: 'PREMIUM' } });
  if (premiumPlan) {
    await prisma.subscription.create({
      data: {
        userId: creatorUser.id,
        planId: premiumPlan.id,
        status: 'ACTIVE',
      },
    });
  }

  // 4. Seed Company Profiles
  const company = await prisma.company.upsert({
    where: { slug: 'nexus-ai' },
    update: {},
    create: {
      userId: creatorUser.id,
      companyName: 'Nexus AI Solutions',
      slug: 'nexus-ai',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      description: 'Building next-generation generative AI infrastructure and developer productivity tools.',
      category: 'Technology',
      website: 'https://nexusai.io',
      isVerified: true,
    },
  });
  console.log('User and Company created.');

  // 5. Seed High-Quality Sample Articles
  const techCategory = await prisma.category.findUnique({ where: { slug: 'technology' } });
  const aiCategory = await prisma.category.findUnique({ where: { slug: 'ai-tools' } });
  const marketingCategory = await prisma.category.findUnique({ where: { slug: 'digital-marketing' } });

  const samplePosts = [
    {
      title: 'Top 10 AI Tools for Developers in 2026',
      slug: 'top-10-ai-tools-for-developers-2026',
      excerpt: 'Explore the most essential artificial intelligence tools boosting engineering velocity and automated code generation.',
      content: `<h2>The Evolution of AI Coding Assistants</h2>
<p>Software development has reached a historic inflection point. Modern generative models allow engineers to focus on architecture, system design, and high-level business logic while repetitive code is generated automatically.</p>
<h3>1. Nexus CodeGen Pro</h3>
<p>Nexus CodeGen Pro provides real-time multi-file editing, context-aware bug fixes, and seamless integration with Next.js and Cloudflare infrastructure. Learn more at <a href="https://nexusai.io" target="_blank" rel="noopener">Nexus AI Solutions</a>.</p>
<h3>2. Deep Mind AI Pair Programmer</h3>
<p>Delivers zero-latency auto-complete and full unit test suite creation with simple voice or natural language prompts.</p>
<h3>Key Benefits for Tech Teams</h3>
<ul>
  <li>Reduces time-to-market by over 40%</li>
  <li>Ensures continuous code linting and security analysis</li>
  <li>Simplifies cross-platform API integrations</li>
</ul>
<p>Integrating these developer tools will give your team a decisive competitive edge in 2026.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      status: 'PUBLISHED' as const,
      authorId: creatorUser.id,
      companyId: company.id,
      categoryId: aiCategory?.id || techCategory!.id,
      publishedAt: new Date(),
      views: 1240,
    },
    {
      title: 'The Ultimate Content Marketing & Backlink Strategy for Startups',
      slug: 'ultimate-content-marketing-backlink-strategy-startups',
      excerpt: 'Learn how modern brands leverage high-authority publishing platforms like PostNest to gain search engine visibility.',
      content: `<h2>Why Quality Publishing Outperforms Traditional Ads</h2>
<p>Paid ad costs continue to rise year over year. Forward-thinking companies are shifting budget toward evergreen content marketing and authoritative article publishing.</p>
<h3>The 4 Pillars of Sustainable Growth</h3>
<ol>
  <li><strong>Authentic Value First:</strong> Write articles that solve specific customer pain points rather than purely selling.</li>
  <li><strong>Strategic Link Placement:</strong> Embed contextual links pointing to official product pages.</li>
  <li><strong>Consistent Publishing Schedule:</strong> Maintain steady activity with quality review.</li>
  <li><strong>Multi-Channel Distribution:</strong> Share published articles across LinkedIn, WhatsApp communities, and newsletters.</li>
</ol>
<p>By publishing strategic posts on platforms like PostNest.in, startups can compound organic traffic and authority organically over time.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      status: 'PUBLISHED' as const,
      authorId: admin.id,
      companyId: null,
      categoryId: marketingCategory!.id,
      publishedAt: new Date(),
      views: 890,
    }
  ];

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log('Sample posts created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
