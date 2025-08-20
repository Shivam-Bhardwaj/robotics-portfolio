import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  eslint: {
    // Skip ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  // Other Next.js configuration
};

export default nextConfig;
