/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scratchclothing.co.uk',
        pathname: '/cdn/shop/files/**',
      },
    ],
  },
};

export default nextConfig;
