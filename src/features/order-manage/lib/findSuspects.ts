// 다른 계정으로 1인 한도를 피하는 주문 찾기. 막지 않고 관리자 화면에 표시만 한다 (가족이 기기·IP·배송지를 같이 쓰는 경우가 있음)
export type OrderSignals = {
  orderId: string;
  email: string;
  deviceId?: string | null;
  ip?: string | null;
  address?: string;
  list: { num: number }[];
};

export type Suspect = { orderId: string; email: string; by: string[] };

const normAddress = (a?: string) => a?.replace(/\s+/g, '').toLowerCase() || undefined;

// 같은 상품을 가진 다른 계정의 주문 중 기기·IP·배송지가 하나라도 겹치는 것
export function findSuspects(target: OrderSignals, others: OrderSignals[]): Suspect[] {
  const nums = new Set(target.list.map((i) => i.num));
  const address = normAddress(target.address);
  return others.flatMap((o) => {
    if (o.email === target.email || !o.list.some((i) => nums.has(i.num))) return [];
    const by = [
      target.deviceId && o.deviceId === target.deviceId ? '같은 기기' : '',
      target.ip && o.ip === target.ip ? '같은 IP' : '',
      address && normAddress(o.address) === address ? '같은 배송지' : '',
    ].filter(Boolean);
    return by.length ? [{ orderId: o.orderId, email: o.email, by }] : [];
  });
}
