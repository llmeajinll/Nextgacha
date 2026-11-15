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

  // 기본 보안 헤더 (docs/policies/engineering.md "보안 헤더").
  // ponytail: CSP는 아직 없음. Toss SDK·카카오·Vercel Blob·GA 출처를 정리한 뒤 Content-Security-Policy 추가
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
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
