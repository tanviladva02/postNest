export interface SeoFeatureItem {
  iconName: string;
  title: string;
  description: string;
}

export interface SeoStepItem {
  step: string;
  title: string;
  description: string;
}

export interface SeoComparisonRow {
  feature: string;
  postNest: string | boolean;
  others: string | boolean;
}

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoPageData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  hero: {
    badgeText: string;
    title: string;
    highlightTitle: string;
    description: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    stats: { label: string; value: string }[];
  };
  features: {
    title: string;
    subtitle: string;
    items: SeoFeatureItem[];
  };
  comparison: {
    title: string;
    subtitle: string;
    headers: string[];
    rows: SeoComparisonRow[];
  };
  steps: {
    title: string;
    subtitle: string;
    items: SeoStepItem[];
  };
  faqs: SeoFaqItem[];
}

export const SEO_LANDING_PAGES: Record<string, SeoPageData> = {
  'best-blogging-platform': {
    slug: 'best-blogging-platform',
    metaTitle: 'Best Blogging Platform for Developers & Writers (2026) | PostNest',
    metaDescription:
      'Looking for the best blogging platform? PostNest provides zero paywalls for readers, automated Google SEO indexing, REST API publishing, and free 30 posts/month.',
    keywords: [
      'best blogging platform',
      'top blogging platform',
      'blogging platform for developers',
      'free publishing site',
      'best blogging site 2026',
      'open web blog platform',
    ],
    canonicalUrl: 'https://www.postnest.in/best-blogging-platform',
    hero: {
      badgeText: '#1 Modern Tech & Open Blogging Platform',
      title: 'The Best Blogging Platform for',
      highlightTitle: 'Developers & Content Creators',
      description:
        'PostNest is built for writers, tech teams, and indie hackers who want total ownership of their content. Zero paywalls, sub-50ms loading speed, clean Markdown editor, and instant Google indexing.',
      primaryCtaText: 'Start Publishing Free',
      primaryCtaHref: '/register',
      secondaryCtaText: 'Explore Published Articles',
      secondaryCtaHref: '/#explore',
      stats: [
        { label: 'Free Monthly Posts', value: '30 Free/Mo' },
        { label: 'Reader Paywalls', value: '0%' },
        { label: 'Google Search Indexing', value: 'Instant' },
        { label: 'API Headless Support', value: 'REST API' },
      ],
    },
    features: {
      title: 'Why PostNest is the Best Blogging Platform in 2026',
      subtitle: 'Engineered from the ground up for maximum visibility, high speed, and ease of use.',
      items: [
        {
          iconName: 'Zap',
          title: 'Automated Google SEO',
          description:
            'Every article is pre-optimized with schema markup, canonical links, XML sitemap auto-sync, and high-performance server-side rendering.',
        },
        {
          iconName: 'ShieldCheck',
          title: 'Zero Reader Paywalls',
          description:
            'Your audience never hits a paywall or email popup. Every article remains 100% accessible to human readers and search engine crawlers.',
        },
        {
          iconName: 'Code',
          title: 'REST API & Headless Publishing',
          description:
            'Publish directly from GitHub Actions, CI/CD pipelines, or custom web apps using our robust developer REST API.',
        },
        {
          iconName: 'FolderUp',
          title: 'Drag & Drop Folder Upload',
          description:
            'Easily upload images, screenshots, and diagrams straight into your posts with zero complex CDN setups required.',
        },
        {
          iconName: 'Building2',
          title: 'Verified Company Hubs',
          description:
            'Create a verified company profile to publish engineering tech blogs, product updates, and press releases under your brand.',
        },
        {
          iconName: 'BarChart3',
          title: 'Real-Time Analytics',
          description:
            'Track view counts, reader engagement metrics, and organic performance from your unified PostNest dashboard.',
        },
      ],
    },
    comparison: {
      title: 'PostNest vs Other Blogging Platforms',
      subtitle: 'See how PostNest compares to legacy platforms like Medium, WordPress, and Substack.',
      headers: ['Feature', 'PostNest', 'Legacy Platforms'],
      rows: [
        { feature: 'Reader Paywalls', postNest: 'Never (100% Open)', others: 'Frequent (Paywalled)' },
        { feature: 'Free Posts Limit', postNest: '30 Posts / Month Free', others: 'Limited / High Fees' },
        { feature: 'Automated Google Schema', postNest: true, others: false },
        { feature: 'Developer REST API', postNest: true, others: false },
        { feature: 'Verified Company Hubs', postNest: true, others: 'Paid Add-on' },
        { feature: 'Page Speed (TTFB)', postNest: '< 50ms (Ultra Fast)', others: 'Slow (Blobbed CSS/JS)' },
      ],
    },
    steps: {
      title: 'Start Publishing in 3 Easy Steps',
      subtitle: 'No complex setup or hosting configuration needed.',
      items: [
        {
          step: '01',
          title: 'Create Your Free Account',
          description: 'Sign up in 10 seconds using Google Auth or email. Get 30 free monthly publishing credits.',
        },
        {
          step: '02',
          title: 'Write or Import Markdown',
          description: 'Use our feature-rich Markdown editor with live preview, code syntax highlighting, and media uploads.',
        },
        {
          step: '03',
          title: 'Publish & Rank on Google',
          description: 'Hit publish to instantly share your content on the open web and auto-generate sitemap links for Google.',
        },
      ],
    },
    faqs: [
      {
        question: 'What makes PostNest the best blogging platform for developers and tech writers?',
        answer:
          'PostNest provides zero paywalls for readers, fast edge rendering, native Markdown support, code syntax highlighting, and a REST API that lets you publish directly from your developer tools or workflows.',
      },
      {
        question: 'Is PostNest completely free to start?',
        answer:
          'Yes! Every new account gets 30 free post publishes per month with full access to canonical URLs, SEO optimization, and social sharing features.',
      },
      {
        question: 'Will my articles be indexed by search engines like Google?',
        answer:
          'Absolutely. PostNest automatically includes your published posts in XML sitemaps, adds Schema.org structured data, and renders pages on the server for instant Googlebot indexing.',
      },
      {
        question: 'Can companies create verified engineering blogs on PostNest?',
        answer:
          'Yes! PostNest supports Verified Company Hubs so engineering teams can publish case studies, technical documentation, and product news under their company identity.',
      },
    ],
  },

  'free-guest-post-site': {
    slug: 'free-guest-post-site',
    metaTitle: 'Free Guest Post Upload Site | Submit Guest Articles | PostNest',
    metaDescription:
      'Looking for a free guest post site? Submit guest posts & articles on PostNest for instant approval, high search indexation, author bios, and backlink growth.',
    keywords: [
      'free guest post site',
      'free guest post upload site',
      'submit guest post',
      'guest blogging platform',
      'guest article submission site',
      'free guest posting platform 2026',
    ],
    canonicalUrl: 'https://www.postnest.in/free-guest-post-site',
    hero: {
      badgeText: 'Instant Approval Guest Blogging Platform',
      title: 'The Top Free Guest Post Upload Site for',
      highlightTitle: 'Writers, Marketers & SEOs',
      description:
        'Submit high-quality guest posts for free on PostNest. Reach thousands of daily readers, build organic authority, showcase your custom author bio, and get your content indexed on search engines rapidly.',
      primaryCtaText: 'Submit Your Guest Post',
      primaryCtaHref: '/register',
      secondaryCtaText: 'Browse Existing Guest Posts',
      secondaryCtaHref: '/#explore',
      stats: [
        { label: 'Guest Submissions', value: '100% Free' },
        { label: 'Monthly Allowance', value: '30 Articles' },
        { label: 'Author Links & Bios', value: 'Supported' },
        { label: 'Google Index Speed', value: '< 24 Hours' },
      ],
    },
    features: {
      title: 'Why PostNest is the Leading Free Guest Post Site',
      subtitle: 'Publish guest articles without editorial friction or absurd paid placement fees.',
      items: [
        {
          iconName: 'FileText',
          title: 'Instant Guest Publishing',
          description:
            'Skip week-long editorial queues. Draft, format, and publish your guest article immediately with clean formatting.',
        },
        {
          iconName: 'Link',
          title: 'Rich Author Bio & Hyperlinks',
          description:
            'Include relevant contextual links and an author profile card pointing back to your main website or portfolio.',
        },
        {
          iconName: 'Globe',
          title: 'Global Organic Traffic',
          description:
            'Your articles are exposed to developers, tech enthusiasts, founders, and industry professionals around the globe.',
        },
        {
          iconName: 'Search',
          title: 'High Search Engine Crawl Rate',
          description:
            'Our high-performance sitemap and server-rendered HTML guarantee fast crawling and indexing by Googlebot.',
        },
        {
          iconName: 'Sparkles',
          title: 'Clean Markdown & Image Uploads',
          description:
            'Embed images, code blocks, bullet points, and tables effortlessly with our modern rich text / Markdown editor.',
        },
        {
          iconName: 'CheckCircle',
          title: 'Zero Hidden Charges',
          description:
            'Unlike traditional paid guest posting sites, PostNest gives you 30 free post submissions every single month.',
        },
      ],
    },
    comparison: {
      title: 'PostNest Guest Posting vs Traditional Guest Post Outlets',
      subtitle: 'Why content creators and SEO agencies choose PostNest over legacy guest post networks.',
      headers: ['Comparison Metric', 'PostNest Free Guest Site', 'Other Guest Posting Outlets'],
      rows: [
        { feature: 'Publishing Cost', postNest: 'Free (30 Posts/Mo)', others: '$50 - $500 / Post' },
        { feature: 'Turnaround Time', postNest: 'Instant', others: '2 - 4 Weeks' },
        { feature: 'Author Bio & Profile', postNest: true, others: 'Often Removed' },
        { feature: 'SEO Schema & Canonical Tags', postNest: true, others: false },
        { feature: 'No Spam / Quality Moderation', postNest: true, others: 'Spammy / PBN Risk' },
      ],
    },
    steps: {
      title: 'How to Submit a Free Guest Post on PostNest',
      subtitle: 'Follow these simple steps to launch your guest article today.',
      items: [
        {
          step: '01',
          title: 'Sign Up for Free',
          description: 'Create your author profile on PostNest to unlock guest post creation features instantly.',
        },
        {
          step: '02',
          title: 'Draft Your Helpful Article',
          description: 'Write an informative, original article. Add relevant categories, tags, images, and author bio links.',
        },
        {
          step: '03',
          title: 'Publish & Share Everywhere',
          description: 'Click publish to make your guest post live on the open internet with immediate SEO indexability.',
        },
      ],
    },
    faqs: [
      {
        question: 'Is it really free to upload guest posts on PostNest?',
        answer:
          'Yes! Every user receives 30 free article publications each month. You can upload guest posts, guides, and tutorials without paying any submission fee.',
      },
      {
        question: 'Can I include links to my website in my guest post?',
        answer:
          'Yes, you can include relevant contextual links and link back to your personal website or social profiles in your author bio.',
      },
      {
        question: 'What topics can I guest post about on PostNest?',
        answer:
          'We welcome articles across technology, software engineering, AI, web development, digital marketing, startup growth, product design, and business strategy.',
      },
      {
        question: 'How fast do guest posts index on Google search?',
        answer:
          'Most published posts on PostNest are crawled and indexed by search engines within 24 to 48 hours thanks to automated XML sitemap feeds and server-side rendering.',
      },
    ],
  },

  'backlink-creator-site': {
    slug: 'backlink-creator-site',
    metaTitle: 'Best Backlink Creator Site | High DA Guest Post & Link Hub | PostNest',
    metaDescription:
      'Build natural, high-authority contextual backlinks with PostNest. The top backlink creator site for SEO professionals, bloggers, and growth marketers.',
    keywords: [
      'backlink creator best site',
      'free backlink site',
      'backlink generator platform',
      'seo backlink creation site',
      'contextual backlink site',
      'guest post backlink platform',
    ],
    canonicalUrl: 'https://www.postnest.in/backlink-creator-site',
    hero: {
      badgeText: 'High-Authority Organic SEO Backlink Engine',
      title: 'The Best Backlink Creator Site for',
      highlightTitle: 'Organic SEO & Ranking Growth',
      description:
        'Supercharge your search rankings. PostNest enables SEO specialists and website owners to publish high-quality contextual content with natural links that boost domain authority and search visibility.',
      primaryCtaText: 'Create Your Backlink Article',
      primaryCtaHref: '/register',
      secondaryCtaText: 'View Pricing & API',
      secondaryCtaHref: '/pricing',
      stats: [
        { label: 'Link Type', value: 'Contextual HTML' },
        { label: 'Googlebot Indexing', value: 'Auto-Sitemap' },
        { label: 'Monthly Links Capacity', value: '30 Free Posts' },
        { label: 'Spam Protection', value: 'AI Moderated' },
      ],
    },
    features: {
      title: 'Why PostNest is the Ultimate Site for Backlink Creation',
      subtitle: 'Build natural authority without risking search engine penalties.',
      items: [
        {
          iconName: 'ExternalLink',
          title: 'Contextual In-Content Links',
          description:
            'Embed natural anchor text links directly inside long-form articles for maximum SEO value transfer to your target pages.',
        },
        {
          iconName: 'TrendingUp',
          title: 'Fast Indexation Signals',
          description:
            'Googlebot frequently indexes PostNest pages. Your backlinks get discovered and evaluated quickly by search algorithms.',
        },
        {
          iconName: 'ShieldAlert',
          title: 'Clean, Penalty-Free Environment',
          description:
            'Our strict automated content filters prevent low-quality spam, keeping PostNest a clean neighborhood for high-tier SEO links.',
        },
        {
          iconName: 'Cpu',
          title: 'Automated REST API Link Publishing',
          description:
            'Automate your content distribution and SEO outreach by publishing blog posts with links programmatically through our API.',
        },
        {
          iconName: 'Sparkles',
          title: 'Social Signals & Syndication',
          description:
            'Every published backlink post is formatted for easy sharing across LinkedIn, Twitter, Reddit, and tech communities.',
        },
        {
          iconName: 'Sliders',
          title: 'Custom Anchor Text Control',
          description:
            'Full control over your Markdown links, anchor text variations, and target URL destinations.',
        },
      ],
    },
    comparison: {
      title: 'PostNest Backlinks vs Automated Link Generators / PBNs',
      subtitle: 'Why real content links on PostNest outperform dangerous automated spam tools.',
      headers: ['SEO Strategy', 'PostNest Content Backlinks', 'Spam Link Generators / PBNs'],
      rows: [
        { feature: 'Google Safety', postNest: '100% Safe & Organic', others: 'High Risk (Google Penalty)' },
        { feature: 'Link Context', postNest: 'Relevant Long-Form Content', others: 'Machine Generated Junk' },
        { feature: 'Index Stability', postNest: 'Permanent Indexing', others: 'De-indexed rapidly' },
        { feature: 'Human Referral Traffic', postNest: true, others: false },
        { feature: 'Developer REST API', postNest: true, others: false },
      ],
    },
    steps: {
      title: 'How to Build Powerful Backlinks on PostNest',
      subtitle: 'Drive rank improvements in 3 systematic steps.',
      items: [
        {
          step: '01',
          title: 'Register Free Account',
          description: 'Get instant access to your author dashboard with 30 monthly post credits.',
        },
        {
          step: '02',
          title: 'Publish Useful Contextual Content',
          description: 'Write an informative guide in your niche and include natural hyperlinked anchor text to your website.',
        },
        {
          step: '03',
          title: 'Monitor Indexing & Rankings',
          description: 'Track how your backlinked article gets crawled by Google and boosts your organic search positions.',
        },
      ],
    },
    faqs: [
      {
        question: 'Why is PostNest considered a great backlink creator site?',
        answer:
          'Unlike spammy link farms, PostNest hosts legitimate, high-quality technical and business articles. Contextual links published inside real articles transfer strong organic trust signals to search engines.',
      },
      {
        question: 'Are backlinks on PostNest safe from Google penalties?',
        answer:
          'Yes! Because PostNest enforces anti-spam moderation and encourages genuine, informative content writing, your links reside in a trustworthy editorial environment.',
      },
      {
        question: 'Can I publish multiple articles with backlinks every month?',
        answer:
          'Yes, free accounts receive 30 post publishes per month. Upgrade to Premium for higher publishing volume and REST API access.',
      },
      {
        question: 'How quickly do search engines recognize links created on PostNest?',
        answer:
          'Thanks to server-side rendering and auto-updating sitemaps, search crawlers discover new PostNest articles rapidly—often within hours.',
      },
    ],
  },

  'free-blog-upload-platform': {
    slug: 'free-blog-upload-platform',
    metaTitle: 'Free Blog Upload Platform | Upload & Publish Articles Online | PostNest',
    metaDescription:
      'Publish blogs for free on PostNest. The easiest free blog upload platform supporting Markdown, image folder uploads, REST API, and fast Google indexing.',
    keywords: [
      'free blog upload platform',
      'upload blog free',
      'blog uploading site',
      'publish blog post free',
      'free article upload platform',
      'online blog publishing platform',
    ],
    canonicalUrl: 'https://www.postnest.in/free-blog-upload-platform',
    hero: {
      badgeText: 'Easiest Free Article & Blog Upload Hub',
      title: 'The #1 Free Blog Upload Platform for',
      highlightTitle: 'Instant Online Publishing',
      description:
        'Upload, format, and share your blogs online without paying for hosting, domains, or expensive subscriptions. PostNest gives you a fast, beautiful platform to upload your stories free.',
      primaryCtaText: 'Upload Your Blog Now',
      primaryCtaHref: '/register',
      secondaryCtaText: 'Explore Platform Features',
      secondaryCtaHref: '/services',
      stats: [
        { label: 'Upload Cost', value: '$0 / Forever' },
        { label: 'Allowed File Formats', value: 'PNG, JPG, WebP' },
        { label: 'Monthly Blog Uploads', value: '30 Articles' },
        { label: 'Hosting & CDN', value: 'Included' },
      ],
    },
    features: {
      title: 'Everything You Need in a Free Blog Upload Platform',
      subtitle: 'No complex CMS setup. No databases to manage. Just pure writing and uploading.',
      items: [
        {
          iconName: 'UploadCloud',
          title: 'Instant Image & Asset Uploads',
          description:
            'Upload cover photos, illustrations, and diagrams directly into your post using our high-speed image engine.',
        },
        {
          iconName: 'Sparkles',
          title: 'Distraction-Free Markdown Editor',
          description:
            'Focus on your thoughts with a sleek editor featuring code blocks, blockquotes, headers, lists, and real-time preview.',
        },
        {
          iconName: 'Globe',
          title: 'Instant Public URL Generation',
          description:
            'Every blog upload immediately receives a clean, SEO-friendly short URL that you can share across social networks.',
        },
        {
          iconName: 'Lock',
          title: 'Secure & Reliable Cloud Hosting',
          description:
            'Your uploaded content is stored on high-availability cloud infrastructure backed by automatic backups.',
        },
        {
          iconName: 'Search',
          title: 'Built-in Search & Category Discovery',
          description:
            'Readers find your uploaded posts through category filters, tag pages, and real-time site search.',
        },
        {
          iconName: 'Smartphone',
          title: '100% Mobile & Desktop Responsive',
          description:
            'Your uploaded articles adapt flawlessly across iPhones, Android devices, tablets, laptops, and desktop screens.',
        },
      ],
    },
    comparison: {
      title: 'Why PostNest Outperforms Basic Free Upload Sites',
      subtitle: 'Compare PostNest against generic free blog hosts and document uploader platforms.',
      headers: ['Feature', 'PostNest', 'Generic Upload Hosts'],
      rows: [
        { feature: 'Formatted Reading Experience', postNest: true, others: false },
        { feature: 'Google Search Indexing', postNest: 'High Priority', others: 'Low / Excluded' },
        { feature: 'Image Upload & Hosting', postNest: 'Free Included', others: 'Broken / Expiring Links' },
        { feature: 'API Automated Uploads', postNest: true, others: false },
        { feature: 'No Intrusive Ads', postNest: true, others: 'Cluttered Banner Ads' },
      ],
    },
    steps: {
      title: 'How to Upload a Blog in 60 Seconds',
      subtitle: 'Get your article published online in 3 quick actions.',
      items: [
        {
          step: '01',
          title: 'Create Your Free Profile',
          description: 'Quick single-click signup to unlock your personal blog uploader dashboard.',
        },
        {
          step: '02',
          title: 'Paste or Type Your Article',
          description: 'Copy your text from Notion, Word, or Markdown files and drop in featured images.',
        },
        {
          step: '03',
          title: 'Click Upload & Publish',
          description: 'Your blog goes live instantly with an optimized public web link.',
        },
      ],
    },
    faqs: [
      {
        question: 'Can I upload blogs for free on PostNest?',
        answer:
          'Yes! PostNest offers 100% free blog uploading up to 30 posts every month with zero hosting or platform fees.',
      },
      {
        question: 'What file formats and media can I include in my blog uploads?',
        answer:
          'You can upload images in PNG, JPG, and WebP formats, embed external media links, and write rich Markdown text.',
      },
      {
        question: 'Do I need technical skills or web hosting knowledge?',
        answer:
          'Not at all. PostNest handles hosting, database storage, SSL security, and web performance automatically.',
      },
      {
        question: 'Can I edit or update my uploaded blog posts later?',
        answer:
          'Yes, you can edit, update, or unpublish your uploaded articles anytime directly from your PostNest dashboard.',
      },
    ],
  },

  'top-blogging-platforms': {
    slug: 'top-blogging-platforms',
    metaTitle: 'Top Blogging Platforms Breakdown & Comparison (2026) | PostNest',
    metaDescription:
      'Comparing the top blogging platforms of 2026. Discover why creators, developers, and tech teams choose PostNest over Medium, Substack, and WordPress.',
    keywords: [
      'top blogging platforms',
      'best blogging platforms comparison',
      'top blog sites 2026',
      'medium alternatives',
      'substack vs postnest',
      'best free blogging platforms',
    ],
    canonicalUrl: 'https://www.postnest.in/top-blogging-platforms',
    hero: {
      badgeText: 'Comprehensive 2026 Platform Review',
      title: 'Top Blogging Platforms Compared:',
      highlightTitle: 'Which One Should You Choose?',
      description:
        'Finding the right platform for your writing or business can be tough. We compare top blogging platforms on SEO control, monetization, reader paywalls, API access, and page speed.',
      primaryCtaText: 'Try PostNest Free',
      primaryCtaHref: '/register',
      secondaryCtaText: 'View Feature Comparison',
      secondaryCtaHref: '#comparison',
      stats: [
        { label: 'Platforms Compared', value: 'Top 5' },
        { label: 'Reader Friction', value: 'Zero Paywall' },
        { label: 'Dev API', value: 'Included' },
        { label: 'SEO Control', value: 'Maximum' },
      ],
    },
    features: {
      title: 'Core Factors to Evaluate in Top Blogging Platforms',
      subtitle: 'Ensure you pick a platform that grows your audience without locking in your content.',
      items: [
        {
          iconName: 'Search',
          title: 'SEO & Search Engine Dominance',
          description:
            'A top blogging platform must provide clean canonical tags, automated XML sitemaps, and fast TTFB so your articles rank on Google.',
        },
        {
          iconName: 'ShieldCheck',
          title: 'Reader Access & Zero Paywalls',
          description:
            'Placing content behind aggressive reader paywalls limits organic virality and hurts social sharing. Open access maximizes reach.',
        },
        {
          iconName: 'Code',
          title: 'Developer Friendly API',
          description:
            'Modern platforms should support headless publishing, letting you write in your IDE and post programmatically via REST API.',
        },
        {
          iconName: 'Building2',
          title: 'Brand & Organization Hubs',
          description:
            'Companies require verified organization spaces where multiple team members can co-author engineering and company updates.',
        },
        {
          iconName: 'Zap',
          title: 'Page Speed & Mobile Performance',
          description:
            'Fast page rendering keeps bounce rates low and improves Google mobile search rankings significantly.',
        },
        {
          iconName: 'Sliders',
          title: 'Content Ownership & Export',
          description:
            'You should always maintain 100% ownership of your articles with full export freedom whenever you choose.',
        },
      ],
    },
    comparison: {
      title: 'Top Blogging Platforms Comparison Matrix',
      subtitle: 'See how PostNest stacks up against other popular publishing platforms.',
      headers: ['Key Capability', 'PostNest', 'Medium', 'Substack', 'WordPress.com'],
      rows: [
        { feature: 'Reader Paywall Free', postNest: '100% Free', others: 'Frequent Paywall' },
        { feature: 'Developer REST API', postNest: true, others: false },
        { feature: 'Automated SEO Schema', postNest: true, others: 'Basic' },
        { feature: 'Verified Company Profiles', postNest: true, others: false },
        { feature: 'Sub-50ms Response Speed', postNest: true, others: false },
      ],
    },
    steps: {
      title: 'How to Migrate to PostNest Today',
      subtitle: 'Switch to a modern open blogging experience in 3 simple steps.',
      items: [
        {
          step: '01',
          title: 'Create Your Free PostNest Account',
          description: 'Sign up in seconds and access your streamlined publishing suite.',
        },
        {
          step: '02',
          title: 'Publish Your Articles',
          description: 'Import existing Markdown posts or write fresh content in our rich editor.',
        },
        {
          step: '03',
          title: 'Enjoy Open Reach & Ranking',
          description: 'Watch your posts rank on search engines without blocking readers behind paywalls.',
        },
      ],
    },
    faqs: [
      {
        question: 'Why choose PostNest over other top blogging platforms like Medium?',
        answer:
          'PostNest guarantees zero reader paywalls, providing 100% open accessibility for your audience and search engine bots. Plus, PostNest features a native REST API, verified company hubs, and faster page speeds.',
      },
      {
        question: 'Is PostNest suitable for developers and tech blogs?',
        answer:
          'Yes! PostNest was engineered with developers in mind, offering code syntax highlighting, clean Markdown formatting, and REST API headless publishing capabilities.',
      },
      {
        question: 'How many posts can I publish for free on PostNest?',
        answer:
          'Free accounts receive 30 published articles per month. Unlimited and enterprise options are also available.',
      },
      {
        question: 'How do I start publishing on PostNest?',
        answer:
          'Simply click the "Start Publishing Free" button, sign up, and create your first article in seconds!',
      },
    ],
  },
};
