import type { AdminReview } from '../model/types';

export const day = (v: string) => (v ?? '').slice(0, 10).replace(/-/g, '.');
export const avgOf = (rs: AdminReview[]) => (rs.length ? rs.reduce((a, x) => a + x.rate, 0) / rs.length : 0);
export const isLow = (r: AdminReview) => r.rate <= 2;
export const fmt = (n: number) => n.toLocaleString('ko-KR');
