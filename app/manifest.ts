import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PostNest Best Free Blogging Platform',
    short_name: 'PostNest',
    description: 'Where developers, startups, and tech writers publish like a pro. Distraction-free publishing, SEO-first distribution, and high-impact company blogs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090a0f',
    theme_color: '#f97316',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192 512x512',
        type: 'image/png',
      },
    ],
  };
}
