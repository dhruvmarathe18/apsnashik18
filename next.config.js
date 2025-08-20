/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
