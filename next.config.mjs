/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NEXT_PUBLIC_DISABLE_OPTIMIZE_IMGS === '1',
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig 