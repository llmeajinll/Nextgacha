import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // pixelarticons/react는 아이콘 1000여 개를 export * 하는 배럴 → 쓰는 아이콘만 번들에 포함
  experimental: {
    optimizePackageImports: ['pixelarticons'],
  },
  compiler: {
    // 프로덕션 빌드에서 console.log 제거 (개인정보/결제정보 로그 노출 방지). error/warn은 유지
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  images: {
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

export default withVanillaExtract(nextConfig);
