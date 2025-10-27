import type { NextConfig } from 'next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

// const withImages = require('next-images');
// module.exports = withImages();

// const withMDX = require('@next/mdx')({
//   extension: /\.mdx$/,
// });

const nextConfig: NextConfig = {
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
};

// module.exports = withVanillaExtract(nextConfig);

export default withVanillaExtract(nextConfig);
