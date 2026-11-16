// DB 테스트(pnpm test:db)용 import 해석: '@/' → src/, 확장자 없는 경로는 .ts / /index.ts 를 붙여 본다.
// plain Node(--experimental-strip-types)는 tsconfig paths와 확장자 생략을 모르기 때문. 의존성 없이 node:module 훅만 쓴다.
// node --import ./scripts/ts-alias.mjs 로 불러오면 자기 자신을 훅으로 등록한다 (훅 스레드에서는 등록하지 않음)
import { register } from 'node:module';
import { isMainThread } from 'node:worker_threads';

if (isMainThread) register(import.meta.url);

const SRC = new URL('../src/', import.meta.url);

export async function resolve(specifier, context, next) {
  const spec = specifier.startsWith('@/') ? new URL(specifier.slice(2), SRC).href : specifier;
  try {
    return await next(spec, context);
  } catch (err) {
    const local = spec.startsWith('.') || spec.startsWith('file:');
    if (!local || !['ERR_MODULE_NOT_FOUND', 'ERR_UNSUPPORTED_DIR_IMPORT'].includes(err?.code)) throw err;
    for (const suffix of ['.ts', '/index.ts']) {
      try {
        return await next(spec + suffix, context);
      } catch {}
    }
    throw err;
  }
}
