# 데이터 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 시간 저장 형식
- 상태: 미정
- 정책: 미정. 추천안은 DB에는 UTC `Date`로 저장하고, 화면에 보여줄 때만 KST로 바꾸는 것.
- 결정할 것: 기존 문자열 날짜를 일괄 변환할지, 새 문서부터만 바꿀지(둘이 섞이면 정렬과 기간 쿼리가 깨진다)
- 이유: 지금 `koreaTime()`은 타임존 정보 없는 KST 문자열(`'YYYY-MM-DD HH:mm:ss'`)을 저장한다. 정렬은 문자열 비교에 의존하고, 기간 조회나 TTL 인덱스를 쓸 수 없다.
- 코드: `src/shared/lib/koreaTime.ts:8`
- 변경 이력: 2026-11-09 신설

## 유니크 인덱스
- 상태: 제안
- 정책: `orderColl.orderId`, `userColl.email`, `cartColl.user`, `productColl.num`에 유니크 인덱스를 건다.
- 이유: 지금은 중복을 애플리케이션 코드로만 막는다. 첫 로그인 요청이 동시에 두 번 오면 `findOne` → `insertOne` 사이 경쟁으로 같은 이메일의 유저 문서가 2개 생길 수 있다.
- 코드: `src/auth.ts:19` (인덱스 정의는 없음)
- 변경 이력: 2026-11-09 신설

## 스키마와 마이그레이션
- 상태: 미정
- 정책: 미정. 컬렉션별 문서 타입을 `entities/*/model`에 정의하고, 필드를 추가하면 기존 문서 처리 방법(일괄 마이그레이션 / 읽을 때 기본값)을 PR에 적는다.
- 결정할 것: Mongo `$jsonSchema` 검증을 걸지, 마이그레이션 스크립트를 어디에 둘지
- 이유: 지금은 스키마 검증이 없고 `any`가 많다. 필드가 없는 옛 문서는 그때그때 `?? 0`으로 처리하고 있다.
- 코드: `src/app/api/postCheckToSending/route.ts:59` (`usedPoint ?? 0`)
- 변경 이력: 2026-11-09 신설

## 환경 분리와 백업
- 상태: 미정
- 정책: 미정. 지금은 운영(`gacha`)과 개발(`gacha_dev`)이 같은 클러스터, 같은 계정이다.
- 결정할 것:
  - 개발용 클러스터나 계정을 따로 둘지
  - 백업 주기와 보존 기간, 복구 절차 (Atlas 백업 사용 여부)
- 이유: 개발 환경에서 실수로 운영 DB를 건드릴 수 있고, 데이터가 지워졌을 때 복구 방법이 정해져 있지 않다.
- 코드: `src/shared/api/mongodb.ts:14`
- 변경 이력: 2026-11-09 신설

## 상품 이미지 업로드
- 상태: 제안
- 정책: 업로드 전에 파일 형식(`image/png`, `image/jpeg`, `image/webp`)과 크기(4MB 이하, Vercel 함수 요청 본문 한도 4.5MB 안쪽)를 확인한다. 저장 경로의 확장자는 실제 형식을 따른다.
- 이유: 지금은 형식과 크기를 확인하지 않고, 어떤 파일이든 `images/{num}.png`로 저장한다.
- 코드: `src/app/api/postProduct/route.ts:36`
- 변경 이력: 2026-11-09 신설

## DB 선택 기본값
- 상태: 제안
- 정책: `MONGODB_DB`가 없으면 기본값으로 붙지 않고 에러를 낸다. 운영 환경에도 `MONGODB_DB=gacha`를 명시한다.
- 이유: 지금은 `MONGODB_DB ?? 'gacha'`라서, 로컬이나 새 환경에서 변수 하나만 빠져도 조용히 **운영 DB**에 붙는다. `MONGODB_URI`는 모든 환경이 같은 값이라 접속 자체는 성공한다. Vercel에는 `MONGODB_DB`가 development·preview에만 있고 production에는 없다(기본값에 의존).
- 코드: `src/shared/api/mongodb.ts:15`
- 구현 시 바뀌는 곳: `mongodb.ts` 한 줄, Vercel production에 `MONGODB_DB` 추가
- 변경 이력: 2026-11-09 신설

## 환경 간 공유 자원 (Blob·결제 키)
- 상태: 제안
- 정책: DB 말고도 쓰기가 일어나는 자원은 환경별로 나눈다. 운영과 preview·로컬이 같은 값을 쓰면 안 되는 것:
  - Vercel Blob: preview·development에 별도 Blob 스토어를 연결한다 (`BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_VERCEL_IMAGE_URL`를 환경별로). 코드 변경 없음.
  - Toss 키: 운영만 live 키, 나머지는 test 키. client key와 secret key는 같은 모드끼리 짝을 맞춘다.
- 이유: Blob 토큰과 이미지 URL은 지금 세 환경이 같은 값이다. `gacha_dev`는 운영의 복사본이라 상품 번호 카운터도 같다. 개발에서 상품을 하나 등록하면 운영 스토어에 `images/{N+1}.png`가 먼저 생기고, 이후 운영에서 N+1번 상품을 등록할 때 `put`이 "이미 존재" 에러로 실패한다(`@vercel/blob` 2.x는 기본적으로 덮어쓰기를 거부). Toss client key도 세 환경이 한 값이라 운영만 live로 바꿀 수 없다.
- 코드: `src/app/api/postProduct/route.ts:36`, `src/features/purchase/ui/BuyBtn.tsx:159`, 관련 [환경 분리와 백업](#환경-분리와-백업), [환경변수 관리](./infra.md)
- 변경 이력: 2026-11-09 신설

## 데이터 보존 기간
- 상태: 미정
- 정책: 미정. 추천안은 `page_views` 13개월(전년 동월 비교용), `error` 시스템 에러 6개월. 주문은 [회원 탈퇴](./members.md)·법정 보관 기간을 따른다.
- 결정할 것: 기간 값, 지울 방식(TTL 인덱스 / 정기 작업). TTL 인덱스는 `Date` 타입 필드가 필요해서 [시간 저장 형식](#시간-저장-형식)이 먼저 정해져야 한다.
- 이유: 지금은 두 컬렉션 모두 지우는 곳이 없어서 계속 커진다. `getError`는 `errorColl` 전체를 제한 없이 한 번에 읽는다.
- 코드: `src/app/api/track/route.ts`, `src/app/api/getError/route.ts:16`
- 변경 이력: 2026-11-09 신설

## 레포 밖의 DB 로직
- 상태: 제안
- 정책: DB를 바꾸는 코드는 모두 git에 둔다. Atlas Trigger처럼 레포 밖에서 도는 로직은 함수 코드와 스케줄을 `scripts/atlas/`에 복사해 두고, 바꿀 때 같이 커밋한다.
- 선택지:
  - A. 지금처럼 Atlas Trigger를 쓰고 코드 사본만 레포에 둔다 (추천, 변경 최소).
  - B. Vercel Cron + 관리자 전용 API route로 옮긴다. 코드·로그·배포가 한 곳에 모이지만, cron 호출 인증(`CRON_SECRET`)과 matcher 등록이 추가로 필요하다.
- 이유: 매월 이벤트 상태를 초기화하는 Atlas Trigger는 `gacha`만 대상이고, 코드가 레포에 없다. 할인 로직을 바꿀 때 Trigger 쪽을 놓치기 쉽고, Atlas 계정이 없으면 동작을 확인할 방법이 없다.
- 코드: 레포에 없음 (`docs/system-architecture.drawio`에 "Atlas Trigger 매월 이벤트 상태 초기화"로만 표시), 관련 [할인 기간](./discounts.md)
- 변경 이력: 2026-11-09 신설
