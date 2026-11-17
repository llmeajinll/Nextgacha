import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// FSD import 방향 (.claude/rules/fsd.md): 아래 레이어만 import한다.
// slice가 있는 레이어(entities/features/widgets)는 같은 레이어를 @/로 부르는 것 자체를 막는다
// — 다른 slice면 cross-slice 위반, 같은 slice면 상대 경로를 써야 한다.
const LAYERS = ['shared', 'entities', 'features', 'widgets', 'views', 'app'];
const SLICED = ['entities', 'features', 'widgets'];
const fsdImports = (layer) => [
  'error',
  {
    patterns: [
      {
        group: LAYERS.slice(LAYERS.indexOf(layer) + 1).flatMap((l) => [`@/${l}`, `@/${l}/**`]),
        message: `FSD: ${layer}는 위 레이어를 import할 수 없다. 공용 부분을 아래 레이어로 내린다.`,
      },
      ...(SLICED.includes(layer)
        ? [
            {
              group: [`@/${layer}`, `@/${layer}/**`],
              message: `FSD: 같은 레이어 다른 slice import 금지(아래 레이어로 내린다). 같은 slice 안은 상대 경로.`,
            },
          ]
        : []),
    ],
  },
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'build/**', 'storybook-static/**', 'next-env.d.ts']),
  {
    rules: {
      // any는 쓰지 않는다 (docs/policies/typescript.md). 외부 값은 unknown으로 받고 좁힌다
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off',

      'prefer-const': 'off',
      'no-var': 'off',
      'no-console': 'off',

      'react-hooks/exhaustive-deps': 'off',
      // fetch-on-mount / mounted 플래그 패턴이 12곳 — 버그는 아니라 경고로. React Query로 옮길 때 error로 올릴 것
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  ...LAYERS.slice(0, -1).map((layer) => ({
    files: [`src/${layer}/**`],
    rules: { 'no-restricted-imports': fsdImports(layer) },
  })),
  {
    // 한 파일 300줄 이하 (빈 줄·주석 제외). 넘으면 컴포넌트/로직을 나눈다
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: { 'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }] },
  },
  {
    // widgets·views는 조합만 한다. 데이터 요청은 entities/features의 api/ fetcher로 (.claude/rules/fsd.md)
    files: ['src/widgets/**', 'src/views/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'widgets·views에서 fetch 금지: entities/*/api 또는 features/*/api 함수를 만들어 부른다.' },
      ],
    },
  },
]);
