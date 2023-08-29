/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["live.staticflickr.com"],
  },
}

module.exports = nextConfig
