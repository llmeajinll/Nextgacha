# Gacha Mall

한 사람당 하나의 상품을 최대 5개까지 구매할 수 있는 가챠 온라인몰입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | MongoDB / Mongoose |
| Auth | NextAuth v5 (카카오 OAuth) |
| 결제 | TossPayments SDK |
| 서버 상태 | TanStack React Query v5 |
| 전역 상태 | Jotai |
| 스타일링 | Vanilla Extract |
| 이미지 저장 | Vercel Blob |
| 테스트 | Jest + Testing Library + MSW |

## 주요 기능

### 사용자
- 카카오 소셜 로그인
- 상품 탐색 및 검색, 카테고리 필터링
- 상품 찜하기
- 장바구니 담기 (1인당 동일 상품 최대 5개 제한)
- 포인트 결제 (TossPayments 연동)
- 주문 내역 / 배송 현황 조회
- 상품 리뷰 및 Q&A 작성

### 관리자
- 상품 등록 / 수정 / 관리
- 주문 상태 관리 (주문 확인 → 배송중 → 배송 완료)
- 회원 관리
- 매출 통계
- 오류 신고 수신

## 핵심 구현

### 1인당 5개 수량 제한

장바구니(보유) + 배송중(keep) + 임시 수량을 실시간으로 합산해 최대 5개를 넘지 않도록 검증합니다. 재고가 5개 미만이면 재고 수를 상한으로 적용합니다.

```
총 소유 = 장바구니 수량 + 배송중 수량 + 현재 선택 수량
유효 상한 = min(5, 재고)
추가 가능 여부 = 총 소유 < 유효 상한
```

검증은 클라이언트(hook), API, 결제 확인 시 3단계로 이루어집니다.

### 트랜잭션 기반 결제 처리

결제 승인 시 포인트 차감 → 재고 감소 → 주문 생성 → 장바구니 초기화를 MongoDB 트랜잭션으로 묶어 원자성을 보장합니다. 어느 단계에서든 실패하면 전체 롤백됩니다.

```typescript
await mongodbSession.withTransaction(async () => {
  await reducePoint({ ... });
  await reduceStock({ ... });
  await addOrder({ ... });
  await resetCart({ ... });
});
```

### 낙관적 업데이트

장바구니 수량 변경 시 서버 응답을 기다리지 않고 UI를 즉시 업데이트합니다. 요청 실패 시 이전 상태로 자동 복원합니다.

### 이원화된 장바구니 구조

| 구분 | 저장소 | 설명 |
|------|--------|------|
| 임시 장바구니 | Jotai (메모리) | 상품 상세 페이지에서 수량 조정 |
| 실제 장바구니 | MongoDB | 담기 버튼 클릭 후 DB에 저장 |

실수로 장바구니에 추가되는 상황을 방지하고 탐색 중 자유로운 수량 조정을 지원합니다.

### MongoDB Aggregation

장바구니 조회 시 `$facet`으로 장바구니, 배송중 항목, 재고 데이터를 단일 쿼리로 동시에 가져옵니다. 품절된 상품은 자동으로 장바구니에서 제거됩니다.

## 아키텍처

### 컴포넌트 구조 (Atomic Design)

```
src/components/
├── atoms/       # 버튼, 태그, 슬라이더 등 기본 단위
├── molecules/   # 카드, 검색바, 장바구니 항목 등 조합
├── organisms/   # 헤더, 모달, 구매 패널 등 독립 섹션
├── templates/   # 페이지 레이아웃
└── pages/       # 페이지 단위 컴포넌트
```

### 디렉토리 구조

```
src/
├── app/
│   ├── (router)/         # 사용자/관리자 페이지
│   ├── api/              # API 라우트 (30+)
│   └── hooks/            # 커스텀 훅
├── components/           # Atomic Design 컴포넌트
├── lib/                  # 서버 유틸리티 (결제, 재고, 주문)
├── jotai/                # 전역 상태 정의
├── api/                  # 서버 데이터 페칭 함수
├── mocks/                # MSW 목업 핸들러
├── shared/               # 공유 타입 및 유틸
└── styles/               # 전역 테마
```

## 스타일링

Vanilla Extract를 사용해 빌드 타임에 CSS를 생성합니다. 런타임 오버헤드 없이 타입 안전한 스타일링이 가능합니다.

## 인증 흐름

1. 카카오 OAuth 로그인
2. 최초 로그인 시 DB에 사용자 생성 (포인트 지급)
3. 세션 토큰으로 인증 유지
4. `/api/protected/*`, `/mypage/*` 는 미들웨어로 보호


## 실행 방법

```bash
# 패키지 설치
pnpm install

# 개발 서버
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test
```
