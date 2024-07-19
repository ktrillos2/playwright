/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'exitocol.vtexassets.com',
      },
    ],
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]
    config.resolve.fallback = { "fs/promises": false };
    return config;
  },
};

export default nextConfig;
