/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  typescript: {
    // Allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Use minimal webpack stats to reduce memory usage
  webpack: (config, { isServer }) => {
    // Reduce memory usage
    config.stats = 'minimal';
    return config;
  },
  // Suppress non-critical build logs
  poweredByHeader: false,
  // Minimize output
  swcMinify: true,
}

export default nextConfig 