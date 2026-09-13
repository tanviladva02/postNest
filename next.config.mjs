/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

