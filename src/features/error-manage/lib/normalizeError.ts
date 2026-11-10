import type { AdminError, ErrorStatus, ErrorType } from '../model/types';

// 서버가 남기는 기록은 pathname이 API 경로, 사용자 제보는 페이지 경로
export const SYSTEM_PATH = /^\/api\//;
// 실제 기록: '[결제 취소 실패] ...', '[환불 DB 처리 실패 - 결제는 취소됨] ...'
export const PAYMENT_MESSAGE = /^\[(결제 취소 실패|환불 DB 처리 실패)/;

type ErrorDoc = {
  _id: unknown;
  type?: ErrorType;
  status?: ErrorStatus;
  textareaValue?: string;
  pathname?: string;
  created_at?: string;
};

// type·status가 없는 옛 문서는 pathname으로 종류를 정하고 접수로 본다
// ponytail: 읽을 때 기본값 처리, 옛 문서를 scripts/migrations로 채우면 이 분기와 findErrors의 null 조건 제거
export function normalizeError(doc: ErrorDoc): AdminError {
  const textareaValue = doc.textareaValue ?? '';
  const pathname = doc.pathname ?? '';
  const type = doc.type ?? (SYSTEM_PATH.test(pathname) ? 'system' : 'report');
  return {
    _id: String(doc._id),
    type,
    status: doc.status ?? '접수',
    isPayment: type === 'system' && PAYMENT_MESSAGE.test(textareaValue),
    textareaValue,
    pathname,
    created_at: doc.created_at ?? '',
  };
}
