import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run

  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  //   transform: {
  //     '^.+\\.(ts|tsx)$': [
  //       'ts-jest',
  //       {
  //         tsconfig: { jsx: 'react-jsx' }, // 이 부분 추가
  //       },
  //     ],
  //   },

  transformIgnorePatterns: [
    'node_modules/(?!(jotai-tanstack-query|jotai)/)',
    //              ↑ ESM 모듈들을 변환 대상에 포함
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
