import type { CategoryMenu } from '../model/types';

// 고정 대분류 이름. 관리자가 추가하는 대분류는 이 이름을 쓸 수 없음
export const RESERVED_GROUP_NAMES = ['메인', '캐릭터', '애니메이션', '시리즈'];

const MAX_LEN = 30;
const MAX_ITEMS = 100;

const text = (v: unknown) => {
  const t = typeof v === 'string' ? v.trim() : '';
  return t && t.length <= MAX_LEN ? t : null;
};

// 빈 값·중복·문자열 아닌 값(연산자 객체 등)이 하나라도 있으면 null
const list = (v: unknown) => {
  if (!Array.isArray(v) || v.length > MAX_ITEMS) return null;
  const out = v.map(text);
  if (out.some((x) => x === null) || new Set(out).size !== out.length) return null;
  return out as string[];
};

// 관리자 화면이 보낸 메뉴 전체를 검사해서 정리된 값으로 돌려줌. 형식이 틀리면 null
export function parseCategoryMenu(body: unknown): CategoryMenu | null {
  if (!body || typeof body !== 'object') return null;
  const { character, ani, series, groups } = body as Record<string, unknown>;
  const c = list(character);
  const a = list(ani);
  if (!c || !a || !Array.isArray(series) || series.length > MAX_ITEMS) return null;

  const makers = series.map((m) => {
    if (!m || typeof m !== 'object') return null;
    const company = text((m as Record<string, unknown>).company);
    const name = text((m as Record<string, unknown>).name);
    const items = list((m as Record<string, unknown>).items);
    return company && name && items ? { company, name, items } : null;
  });
  if (makers.some((m) => m === null)) return null;
  const s = makers as CategoryMenu['series'];
  if (new Set(s.map((m) => m.company)).size !== s.length) return null;

  if (!Array.isArray(groups) || groups.length > MAX_ITEMS) return null;
  const extra = groups.map((g) => {
    if (!g || typeof g !== 'object') return null;
    const name = text((g as Record<string, unknown>).name);
    const items = list((g as Record<string, unknown>).items);
    return name && items && !RESERVED_GROUP_NAMES.includes(name) ? { name, items } : null;
  });
  if (extra.some((g) => g === null)) return null;
  const e = extra as CategoryMenu['groups'];
  if (new Set(e.map((g) => g.name)).size !== e.length) return null;

  return { character: c, ani: a, series: s, groups: e };
}
