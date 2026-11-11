import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBannerForm } from './parseBannerForm.ts';
import { statusOf } from '../../../entities/banner/model/types.ts';

const ok = { title: ' 11월 신규 ', link: '/search?tag=new', start: '2026-11-01', end: '', visible: 'true' };

test('정상 폼은 정리되어 통과', () => {
  assert.deepEqual(parseBannerForm(ok), { title: '11월 신규', link: '/search?tag=new', start: '2026-11-01', end: '', visible: true });
});

test('외부 링크·잘못된 기간·빈 이름은 거절', () => {
  for (const link of ['https://evil.com', '//evil.com', '/\\evil.com', 'javascript:alert(1)', '/a b']) {
    assert.equal(parseBannerForm({ ...ok, link }), null, link);
  }
  assert.equal(parseBannerForm({ ...ok, end: '2026-10-31' }), null);
  assert.equal(parseBannerForm({ ...ok, start: '2026-13-01' }), null);
  assert.equal(parseBannerForm({ ...ok, title: '  ' }), null);
  assert.equal(parseBannerForm({ ...ok, visible: 'yes' }), null);
  assert.equal(parseBannerForm({ ...ok, title: { $ne: '' } }), null);
});

test('상태: 숨김 → 종료 → 예약 → 게시 중', () => {
  const today = '2026-11-12';
  assert.equal(statusOf({ visible: false, start: '2026-11-01', end: '' }, today), 'hidden');
  assert.equal(statusOf({ visible: true, start: '2026-11-01', end: '2026-11-11' }, today), 'ended');
  assert.equal(statusOf({ visible: true, start: '2026-11-13', end: '' }, today), 'soon');
  assert.equal(statusOf({ visible: true, start: '2026-11-12', end: '2026-11-12' }, today), 'live');
});
