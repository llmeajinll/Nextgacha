# 서비스 정책

도메인별 정책 문서 모음. `.claude/agents/policy-maker.md`가 관리한다.
금액·한도 값의 실제 기준은 `src/features/purchase/lib/orderPolicy.ts`이고, 이미 동작 중인 핵심 규칙(1인 5개 한도, 결제 서버 재검증, 주문 상태 전이 가드)은 `CLAUDE.md`에 있다.

## 상태

- `확정`: 결정됨 (구현 전이면 `코드: 미구현`)
- `제안`: 추천안 있음, 결정 대기
- `미정`: 값이나 방향을 정해야 함

### 결정할 때

1. `상태:`를 `확정`으로 바꾼다.
2. `선택지:`는 고른 안만 `정책:`에 남기고 지운다. `미정`이었다면 값을 채우고 `결정할 것:`을 지운다.
3. `변경 이력:`에 `YYYY-MM-DD 확정 (A안)`처럼 한 줄 추가한다. 안 하기로 했으면 블록을 지우지 말고, `정책: 하지 않는다`와 이유를 적어 확정한다.
4. 구현 전이면 `코드: 미구현`으로 두고, 구현한 커밋에서 실제 파일:줄로 바꾼다.

## 문서 목록

| 파일 | 도메인 |
|---|---|
| [payments.md](./payments.md) | 주문/결제 |
| [refunds.md](./refunds.md) | 취소/환불/반품 |
| [purchase-limit.md](./purchase-limit.md) | 구매 한도 |
| [points.md](./points.md) | 포인트 |
| [discounts.md](./discounts.md) | 할인/이벤트 |
| [preorders.md](./preorders.md) | 예약 판매 |
| [reviews.md](./reviews.md) | 리뷰/QnA |
| [members.md](./members.md) | 회원/개인정보 |
| [admin.md](./admin.md) | 관리자 (재고 수정, 관리자 입력, 작업 기록) |
| [api.md](./api.md) | API 규약 (응답 형식, 에러 처리, 입력 검증, 인증 위치, 남용 방지) |
| [data.md](./data.md) | 데이터 (시간 형식, 인덱스, 스키마, 백업, 업로드, 환경 간 공유 자원, 보존 기간) |
| [engineering.md](./engineering.md) | 개발 (계산식 단일 출처, 에러 알림, 로그, 테스트, 보안 헤더) |
| [operations.md](./operations.md) | 운영 (주문 확인 기한, 품절, 문의 답변, 오류 제보, 관리자 등급, 이벤트) |
| [deploy.md](./deploy.md) | 배포·릴리스 (환경, 브랜치, 머지 조건, CI 범위, 환경변수, DB 변경, 롤백, 빌드 캐시) |
| [incident.md](./incident.md) | 장애 대응 (등급, 감지, 대응 순서, 결제 불일치, 복구 목표, 사후 기록) |
| [design.md](./design.md) | 디자인·UX (아이콘, 색 사용, 접근성, 문구, 화면 크기, Storybook) |
| [infra.md](./infra.md) | 서버 (Node 버전, 서버 전용 코드, 외부 호출 타임아웃) |
| [ux.md](./ux.md) | 프론트 UX 비기능 (로딩, 중복 제출, 알림, 에러 문구, 성능 기준) |

## 정책 블록 형식

```
## 정책 이름
- 상태: 확정 | 제안 | 미정
- 정책: 한두 문장
- 예외:
- 이유:
- 코드: path/to/file.ts:줄 (아직 구현 안 됐으면 "미구현")
- 변경 이력: YYYY-MM-DD 신설
```
