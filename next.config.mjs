/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // For CSV uploads
    },
  },
};

export default nextConfig;
