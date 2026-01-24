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
  // Optimize build for Vercel
  swcMinify: true,
  typescript: {
    // Type checking is done in the CI/CD pipeline
    ignoreBuildErrors: true,
  },
  eslint: {
    // Linting is done in the CI/CD pipeline
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
