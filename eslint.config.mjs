import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
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
]);
