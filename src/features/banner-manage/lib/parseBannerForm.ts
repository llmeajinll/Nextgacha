// 배너 저장 폼 검증 (route와 화면이 같은 규칙을 쓴다)
export type BannerForm = { title: string; link: string; start: string; end: string; visible: boolean };

export const TITLE_MAX = 40;

const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

// 링크는 쇼핑몰 안 경로만 ('/'로 시작, '//'나 '\'로 시작하는 외부 주소 차단)
export const isSafeLink = (v: string) => v === '' || (/^\/(?![/\\])/.test(v) && v.length <= 200 && !/\s/.test(v));

export function parseBannerForm(b: Record<string, unknown>): BannerForm | null {
  const str = (k: string) => (typeof b[k] === 'string' ? (b[k] as string).trim() : null);
  const title = str('title');
  const link = str('link');
  const start = str('start');
  const end = str('end');
  if (title === null || link === null || start === null || end === null) return null;
  if (!title || title.length > TITLE_MAX || !isSafeLink(link) || !isDate(start)) return null;
  if (end && (!isDate(end) || end < start)) return null;
  if (b.visible !== 'true' && b.visible !== 'false') return null;
  return { title, link, start, end, visible: b.visible === 'true' };
}
