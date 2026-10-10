// 결제 금액/포인트/보유 한도 정책 (순수 함수, DB 접근 없음)
// 클라이언트 계산식(CartTemplate, InfoPanel)과 반드시 같게 유지할 것

export const MAX_PER_ITEM = 5;
export const FREE_SHIPPING_MIN = 50000;
export const SHIPPING_FEE = 3000;
export const MIN_PAYMENT = 1000;

export type OrderLine = {
  num: number;
  product: { name: string; count: number }[];
};

type PricedProduct = { num: number; price: number; discount?: number };

export function isValidOrderList(list: unknown): list is OrderLine[] {
  return (
    Array.isArray(list) &&
    list.length > 0 &&
    list.every(
      (line) =>
        Number.isInteger(line?.num) &&
        Array.isArray(line.product) &&
        line.product.length > 0 &&
        line.product.every(
          (p: any) =>
            typeof p?.name === 'string' &&
            Number.isInteger(p.count) &&
            p.count > 0,
        ),
    )
  );
}

export function calcOrder(
  products: PricedProduct[],
  list: OrderLine[],
  usedPoint: number,
) {
  const unitPrice = new Map(
    products.map((p) => [p.num, p.price * (1 - (p.discount ?? 0) / 100)]),
  );

  let subtotal = 0;
  for (const line of list) {
    const price = unitPrice.get(line.num);
    if (price === undefined) return null;
    for (const p of line.product) subtotal += p.count * price;
  }

  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    shipping,
    // 포인트로 깎을 수 있는 최대치: 최소 결제금액(MIN_PAYMENT)은 남겨야 함
    maxUsablePoint: subtotal + shipping - MIN_PAYMENT,
    total: subtotal + shipping - usedPoint,
    addPoint: Math.floor(subtotal * 0.01),
  };
}

// user.keep(배송중)에 이번 주문을 더한 결과
export function mergeKeep(keep: OrderLine[], list: OrderLine[]): OrderLine[] {
  const next = structuredClone(keep);
  for (const line of list) {
    let group = next.find((g) => g.num === line.num);
    if (!group) {
      group = { num: line.num, product: [] };
      next.push(group);
    }
    for (const p of line.product) {
      const item = group.product.find((v) => v.name === p.name);
      if (item) item.count += p.count;
      else group.product.push({ name: p.name, count: p.count });
    }
  }
  return next;
}

// 한도를 넘는 첫 상품 이름 (없으면 null)
export function overCapItem(keep: OrderLine[]): string | null {
  for (const group of keep) {
    for (const p of group.product) {
      if (p.count > MAX_PER_ITEM) return p.name;
    }
  }
  return null;
}

// user.keep(배송중)에서 주문 수량을 뺀 결과 (0 이하 상품, 빈 그룹은 제거)
export function subtractKeep(keep: OrderLine[], list: OrderLine[]): OrderLine[] {
  return keep
    .map((group) => {
      const line = list.find((l) => l.num === group.num);
      if (!line) return group;
      return {
        ...group,
        product: group.product
          .map((p) => {
            const sub = line.product.find((v) => v.name === p.name)?.count ?? 0;
            return { ...p, count: p.count - sub };
          })
          .filter((p) => p.count > 0),
      };
    })
    .filter((group) => group.product.length > 0);
}
