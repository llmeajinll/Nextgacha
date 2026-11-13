import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boldParts, dotDate, isNewNotice, statusOf, toBlocks } from './types.ts';

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

test('## 소제목, > 인용은 따로 나뉜다', () => {
  assert.deepEqual(toBlocks('안내\n## 일정\n본문\n> 양해 부탁'), [
    { type: 'text', text: '안내' },
    { type: 'head', text: '일정' },
    { type: 'text', text: '본문' },
    { type: 'quote', text: '양해 부탁' },
  ]);
});

test('**굵게**만 굵은 글 조각이 된다', () => {
  assert.deepEqual(boldParts('가 **나** 다'), [
    { text: '가 ', bold: false },
    { text: '나', bold: true },
    { text: ' 다', bold: false },
  ]);
});

test('날짜 표기와 NEW (최근 공지로부터 7일)', () => {
  assert.equal(dotDate('2025-12-20 12:00'), '2025.12.20');
  assert.equal(dotDate('2025-12-20 12:00', true), '2025.12.20 12:00');
  assert.equal(isNewNotice({ publish_at: '2025-12-13 09:00' }, '2025-12-20 12:00'), true);
  assert.equal(isNewNotice({ publish_at: '2025-12-12 09:00' }, '2025-12-20 12:00'), false);
});
