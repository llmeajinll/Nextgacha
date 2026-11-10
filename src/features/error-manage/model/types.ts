// 오류 기록(errorColl) 처리 상태와 관리자 화면 쿼리 값(/manager/error?status={slug})
export const ERROR_STATUSES = [
  { status: '접수', slug: 'open' },
  { status: '처리 완료', slug: 'done' },
  { status: '무시', slug: 'ignored' },
] as const;

export type ErrorStatus = (typeof ERROR_STATUSES)[number]['status'];

export const isErrorStatus = (v: unknown): v is ErrorStatus => ERROR_STATUSES.some((s) => s.status === v);

// report: 사용자 제보(postError), system: 서버가 남긴 기록(결제 취소 실패 등)
export const ERROR_TYPES = [
  { type: 'all', label: '전체' },
  { type: 'report', label: '사용자 제보' },
  { type: 'system', label: '시스템' },
] as const;

export type ErrorTypeFilter = (typeof ERROR_TYPES)[number]['type'];
export type ErrorType = Exclude<ErrorTypeFilter, 'all'>;

export const ERROR_PAGE_SIZE = 20;

export type AdminError = {
  _id: string;
  type: ErrorType;
  status: ErrorStatus;
  // 결제·환불 불일치 기록: 장애 대응(docs/policies/incident.md 결제 불일치 처리)으로 바로 처리
  isPayment: boolean;
  textareaValue: string;
  pathname: string;
  created_at: string;
};
