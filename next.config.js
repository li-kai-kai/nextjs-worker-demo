/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable src directory support
    esmExternals: 'loose'
  },
  // Configure webpack for better module resolution
  webpack: (config, { isServer }) => {
    // Add alias for src directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }
    
    return config
  },
}

module.exports = nextConfig