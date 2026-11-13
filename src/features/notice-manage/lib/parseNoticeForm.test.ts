import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNoticeForm } from './parseNoticeForm.ts';

const ok = { category: 'ship', title: ' 설 연휴 배송 안내 ', content: '배송이 늦어져요.\n', pinned: true, state: 'published', publish_at: '' };

test('정상 폼은 정리되어 통과', () => {
  assert.deepEqual(parseNoticeForm(ok), { ...ok, title: '설 연휴 배송 안내', content: '배송이 늦어져요.' });
});

test('임시 저장은 내용 없이도 되고 고정은 풀린다', () => {
  assert.deepEqual(parseNoticeForm({ ...ok, state: 'draft', content: '' }), { ...ok, title: '설 연휴 배송 안내', content: '', state: 'draft', pinned: false });
});

test('잘못된 값은 거절', () => {
  assert.equal(parseNoticeForm({ ...ok, category: 'etc' }), null);
  assert.equal(parseNoticeForm({ ...ok, title: ' ' }), null);
  assert.equal(parseNoticeForm({ ...ok, content: '![이미지](https://a.public.blob.vercel-storage.com/x.png)' }), null);
  assert.equal(parseNoticeForm({ ...ok, publish_at: '2026-11-13T10:00' }), null);
  assert.equal(parseNoticeForm({ ...ok, pinned: 'true' }), null);
  assert.equal(parseNoticeForm({ ...ok, title: { $ne: '' } }), null);
});
