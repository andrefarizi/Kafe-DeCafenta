import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['midtrans-client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
      }
    ],
  },
};

export default nextConfig;
