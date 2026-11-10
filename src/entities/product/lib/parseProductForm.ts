// 상품 등록 폼(postProduct) 검증. 파일은 라우트에서 따로 확인하고, 여기서는 문자열 필드만 본다.
// 상세 블록의 이미지는 아직 url이 없어서 { type: 'image' } 자리만 받는다.
export type ProductForm = {
  title: string;
  price: number;
  discount: number;
  company: string;
  group: string[];
  list: { name: string; count: number }[];
  reserve: { start: Date; end: Date; ship: Date } | null;
  detail: ({ type: 'text'; text: string } | { type: 'image' })[];
};

const text = (v: unknown, max: number) =>
  typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max ? v.trim() : null;

const int = (v: unknown, min: number, max: number) => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
};

const json = (v: unknown): unknown => {
  try {
    return typeof v === 'string' ? JSON.parse(v) : null;
  } catch {
    return null;
  }
};

const date = (v: unknown) => {
  const d = typeof v === 'string' ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

// validateStock이 옵션을 이름으로 찾으므로 이름이 겹치면 안 됨
function parseList(raw: unknown, minCount: number) {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 50) return null;
  const list = raw.map((o) => {
    const name = text(o?.name, 50);
    const count = int(String(o?.count ?? ''), minCount, 9999);
    return name === null || count === null ? null : { name, count };
  });
  if (list.some((o) => o === null)) return null;
  const names = list.map((o) => o!.name);
  return new Set(names).size === names.length ? (list as ProductForm['list']) : null;
}

export function parseProductForm(f: Record<string, unknown>): ProductForm | null {
  const title = text(f.title, 100);
  const price = int(f.price, 1, 10_000_000);
  const discount = f.discount ? int(f.discount, 0, 99) : 0;
  const company = f.company ? text(f.company, 30) : '';
  if (title === null || price === null || discount === null || company === null) return null;

  const groupRaw = json(f.group);
  if (!Array.isArray(groupRaw) || groupRaw.length < 1 || groupRaw.length > 30) return null;
  const group = groupRaw.map((g) => text(g, 30));
  if (group.some((g) => g === null)) return null;

  const list = parseList(json(f.list), 1);
  if (!list) return null;

  let reserve: ProductForm['reserve'] = null;
  if (f.reserveStart || f.reserveEnd || f.reserveShip) {
    const start = date(f.reserveStart);
    const end = date(f.reserveEnd);
    const ship = date(f.reserveShip);
    if (!start || !end || !ship || end < start) return null;
    reserve = { start, end, ship };
  }

  const detailRaw = json(f.detail ?? '[]');
  if (!Array.isArray(detailRaw) || detailRaw.length > 30) return null;
  const detail = detailRaw.map((b) => {
    if (b?.type === 'image') return { type: 'image' as const };
    const t = b?.type === 'text' ? text(b.text, 2000) : null;
    return t === null ? null : { type: 'text' as const, text: t };
  });
  if (detail.some((b) => b === null)) return null;

  return {
    title,
    price,
    discount,
    company,
    group: [...new Set(group as string[])],
    list,
    reserve,
    detail: detail as ProductForm['detail'],
  };
}

// 상품 관리 화면의 수정(postEditProduct). 이미 있는 상품이라 재고 0(품절)도 허용
export type ProductEdit = Pick<ProductForm, 'price' | 'discount' | 'list'> & { num: number };

export function parseProductEdit(b: unknown): ProductEdit | null {
  if (!b || typeof b !== 'object') return null;
  const f = b as Record<string, unknown>;
  const num = int(String(f.num ?? ''), 1, Number.MAX_SAFE_INTEGER);
  const price = int(String(f.price ?? ''), 1, 10_000_000);
  const discount = int(String(f.discount ?? '0'), 0, 99);
  const list = parseList(f.list, 0);
  if (num === null || price === null || discount === null || !list) return null;
  return { num, price, discount, list };
}

// 이벤트 관리(postEvent): 고른 상품들에 같은 할인율을 걸거나(1~99) 내린다(0)
export type ProductEvent = { discount: number; nums: number[] };

export function parseProductEvent(b: unknown): ProductEvent | null {
  if (!b || typeof b !== 'object') return null;
  const f = b as Record<string, unknown>;
  const discount = int(String(f.discount ?? ''), 0, 99);
  if (discount === null || !Array.isArray(f.nums) || f.nums.length < 1 || f.nums.length > 500) return null;
  const nums = f.nums.map((n) => (typeof n === 'number' ? int(String(n), 1, Number.MAX_SAFE_INTEGER) : null));
  if (nums.some((n) => n === null)) return null;
  return { discount, nums: [...new Set(nums as number[])] };
}
