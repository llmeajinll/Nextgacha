// 결제 장애 때 Vercel 환경변수 PAYMENTS_DISABLED=1 + 재배포로 결제를 막는다 (docs/policies/incident.md "사용자 공지")
// 버튼(postCheckStock)과 승인(postPaymentsConfirm) 양쪽에서 확인해서 버튼을 우회한 요청도 막는다
export const PAYMENTS_DISABLED_MESSAGE = '지금은 결제를 잠시 중단했습니다. 공지사항을 확인해주세요.';
export const isPaymentDisabled = () => process.env.PAYMENTS_DISABLED === '1';
