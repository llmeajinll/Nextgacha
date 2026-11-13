import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statusOf, toBlocks } from './types.ts';

const IMG = 'https://abc123.public.blob.vercel-storage.com/notice/1.png';

test('상태: 임시 저장 → 예약 → 게시 중', () => {
  const now = '2026-11-13 10:00';
  assert.equal(statusOf({ state: 'draft', publish_at: '2026-11-01 10:00' }, now), 'draft');
  assert.equal(statusOf({ state: 'published', publish_at: '2026-11-13 10:01' }, now), 'soon');
  assert.equal(statusOf({ state: 'published', publish_at: '2026-11-13 10:00' }, now), 'live');
});

test('본문은 글 덩어리와 이미지 줄로 나뉜다', () => {
  assert.deepEqual(toBlocks(`첫 줄\n둘째 줄\n![이미지](${IMG})\n\n셋째`), [
    { type: 'text', text: '첫 줄\n둘째 줄' },
    { type: 'image', url: IMG },
    { type: 'text', text: '셋째' },
  ]);
});

test('다른 주소 이미지는 그리지 않고 글자로 둔다', () => {
  assert.deepEqual(toBlocks('![x](https://evil.com/a.png)'), [{ type: 'text', text: '![x](https://evil.com/a.png)' }]);
  assert.deepEqual(toBlocks('![x](javascript:alert(1))'), [{ type: 'text', text: '![x](javascript:alert(1))' }]);
});
