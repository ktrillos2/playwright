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
};

export default nextConfig;
