// @/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ewwhmmevesjsaftpmbuh.supabase.co', // Replace if your Supabase project ref is different
        port: '',
        pathname: '/storage/v1/object/public/**', // Allow access to public storage buckets
      },
      // Add other image source hostnames if needed
    ],
  },
  experimental: {
    // These flags might be beneficial but review Next.js docs if issues arise
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;
