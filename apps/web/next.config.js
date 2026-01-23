/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@edunexus/database', '@edunexus/shared'],
  images: {
    domains: ['localhost', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
