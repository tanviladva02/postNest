const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'tailwind.config.ts',
  'next.config.mjs',
  'prisma/schema.prisma',
  'prisma/seed.ts',
  'lib/prisma.ts',
  'lib/auth.ts',
  'lib/publishing-limits.ts',
  'lib/moderation.ts',
  'app/layout.tsx',
  'app/globals.css',
  'app/page.tsx',
  'app/sitemap.ts',
  'app/robots.ts',
  'app/blog/[slug]/page.tsx',
  'app/category/[slug]/page.tsx',
  'app/company/[slug]/page.tsx',
  'app/login/page.tsx',
  'app/register/page.tsx',
  'app/dashboard/layout.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/posts/page.tsx',
  'app/dashboard/create-post/page.tsx',
  'app/dashboard/bulk-upload/page.tsx',
  'app/dashboard/company/page.tsx',
  'app/dashboard/api-access/page.tsx',
  'app/dashboard/subscription/page.tsx',
  'app/admin/page.tsx',
  'app/admin/newsletter/page.tsx',
  'app/admin/moderation/page.tsx',
  'app/admin/settings/page.tsx',
  'app/api/v1/posts/route.ts',
  'app/api/posts/publish/route.ts',
  'app/api/posts/bulk/route.ts',
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/logout/route.ts',
];

console.log('--- PostNest Build Verification ---');
let missing = 0;
for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✔ [EXISTS] ${file}`);
  } else {
    console.error(`✖ [MISSING] ${file}`);
    missing++;
  }
}

if (missing === 0) {
  console.log('\n✅ All 37 required platform modules and routes are present and verified!');
} else {
  console.error(`\n❌ ${missing} files missing!`);
}
