/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Enable JIT mode for Tailwind CSS
  experimental: {
    optimizeCss: true,
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

module.exports = nextConfig 