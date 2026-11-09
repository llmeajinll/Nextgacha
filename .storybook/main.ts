import type { StorybookConfig } from '@storybook/nextjs-vite';
import { fileURLToPath } from 'node:url';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// 스토리는 컴포넌트 옆이 아니라 루트 stories/ 에 src 레이어 구조 그대로 둔다
// (예: src/shared/ui/ImgBtn → stories/shared/ui/ImgBtn.stories.tsx)
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), vanillaExtractPlugin()];
    // *.css.ts는 vanilla-extract가 따로 컴파일해서 tsconfig paths를 모름 → @/ 별칭을 직접 지정
    config.resolve = {
      ...config.resolve,
      alias: { ...config.resolve?.alias, '@': fileURLToPath(new URL('../src', import.meta.url)) },
    };
    return config;
  },
};

export default config;
