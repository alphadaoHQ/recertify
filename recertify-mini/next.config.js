/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@mui/material', '@mui/icons-material'],
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = nextConfig