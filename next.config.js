/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Disable SSR for all components
    if (!isServer) {
      config.resolve.fallback = { fs: false, module: false };
    }

    return config;
  },
};

module.exports = nextConfig;
