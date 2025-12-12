import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin();

// const withImages = require('next-images');
// module.exports = withImages();

// const withMDX = require('@next/mdx')({
//   extension: /\.mdx$/,
// });

const nextConfig: NextConfig = {
  // const nextConfig = {
  /* config options here */
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  images: {
    // cast to any to satisfy (URL | RemotePattern)[] typing for remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
    ],
  },
};
// module.exports = withVanillaExtract(nextConfig);

export default withVanillaExtract(nextConfig);
