/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.cosmicjs.com', 'imgix.cosmicjs.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig