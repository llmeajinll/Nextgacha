import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCategoryMenu } from './parseCategoryMenu.ts';

const ok = {
  character: [' 포켓몬스터 ', '치이카와'],
  ani: ['하이큐'],
  series: [{ company: 'BANDAI', name: '반다이', items: ['언제오려나'] }, { company: 'TOMY', name: '토미', items: [] }],
  groups: [{ name: '게임', items: ['젤다'] }],
};

test('정상 메뉴는 공백을 정리해서 통과', () => {
  assert.deepEqual(parseCategoryMenu(ok)?.character, ['포켓몬스터', '치이카와']);
});

test('문자열이 아닌 값(연산자 객체)은 거부', () => {
  assert.equal(parseCategoryMenu({ ...ok, ani: [{ $gt: '' }] }), null);
});

test('빈 이름·중복 항목은 거부', () => {
  assert.equal(parseCategoryMenu({ ...ok, ani: ['  '] }), null);
  assert.equal(parseCategoryMenu({ ...ok, ani: ['하이큐', '하이큐 '] }), null);
});

test('같은 company 제조사 중복은 거부', () => {
  assert.equal(parseCategoryMenu({ ...ok, series: [ok.series[0], ok.series[0]] }), null);
});

test('형식이 아예 다르면 거부', () => {
  assert.equal(parseCategoryMenu(null), null);
  assert.equal(parseCategoryMenu({ character: [], ani: [] }), null);
});

test('추가 대분류는 고정 이름·중복 이름을 거부', () => {
  assert.equal(parseCategoryMenu({ ...ok, groups: [{ name: '캐릭터', items: [] }] }), null);
  assert.equal(parseCategoryMenu({ ...ok, groups: [ok.groups[0], ok.groups[0]] }), null);
});
