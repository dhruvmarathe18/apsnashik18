/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
