// 코드에 고정돼 있던 공지 20개 + '넥스트가챠 사용 안내'(고정 공지)를 notice 컬렉션으로 옮긴다.
// 실행: node --env-file=.env.local scripts/seed-notices.mjs <DB 이름>
//   DB 이름을 직접 적어야 돈다 (운영 'gacha'에 실수로 넣지 않게). 이미 공지가 있으면 아무것도 안 한다.
import { MongoClient } from 'mongodb';

const dbName = process.argv[2];
if (!dbName) {
  console.error('DB 이름을 적어 주세요. 예: node --env-file=.env.local scripts/seed-notices.mjs gacha_dev');
  process.exit(1);
}

const legacy = [
  {
    num: 20,
    title: '크리스마스 연휴 배송 안내 ',
    created_at: '2025-12-20 12:00:00',
    content: `다가오는 크리스마스 연휴로 인해 배송 일정에 변동이 있을 수 있습니다.\n2025년 12월 24일(목)부터 2025년 12월 28일(일) 사이에 주문한 제품은 택바사의 사정으로 인해 배송이 지연될 수 있습니다.\n고객 여러분의 양해 부탁드립니다.`,
  },
  {
    num: 19,
    title: '[추가] 넥스트가챠 12월 추가 신상 가챠',
    created_at: '2025-12-13 12:00:00',
    content:
      '해당 가챠의 추가 물량이 확인되어 재입고 되었습니다. 많은 관심 부탁드립니다.',
    list: ['리락쿠마 동글동글 동물들 2탄', '포켓몬 해양생물 시리즈 3탄'],
  },
  {
    num: 18,
    title: '[예약] 넥스트가챠 12월 예약 판매 안내',
    created_at: '2025-12-12 12:00:00',
    content:
      '2026년 3월 출시 예정 가챠의 예약 판매가 시작되었습니다. 한정 수량으로 준비된 이번 제품을 놓치지 마세요!',
    list: ['치이카와 산리오 콜라보 1탄', '산리오 주먹밥 메지루시'],
  },
  {
    num: 17,
    title: '[이벤트] 넥스트가챠 12월 이벤트 안내',
    created_at: '2025-12-01 12:00:00',
    content:
      '2025년 12월 한 달간 넥스트가챠에서 구매 시 포인트가 2배 적립되는 이벤트가 진행됩니다. 많은 참여 부탁드립니다.',
  },
  {
    num: 16,
    title: '[신상] 넥스트가챠 12월 신상 가챠',
    created_at: '2025-12-01 12:00:00',
    content:
      '2025년 12월 신상 가챠가 출시되었습니다. 인기 캐릭터와 애니메이션을 테마로 한 다양한 제품이 준비되어 있습니다. 지금 바로 확인해보세요!',
    list: [
      '치이카와 우물우물 파티 3탄',
      '치이카와 나란히 2탄',
      '다마고치 메지루시 2탄',
    ],
  },
  {
    num: 15,
    title: '[공지] 11월 이벤트 조기 종료',
    created_at: '2025-11-25 12:00:00',
    content:
      '11월 추가 가챠 증정 이벤트가 재고 소진으로 인해 조기 종료되었습니다. 참여해주신 모든 분들께 감사드립니다.',
  },
  {
    num: 14,
    title: '[추가] 넥스트가챠 11월 추가 신상 가챠',
    created_at: '2025-11-20 12:00:00',
    content:
      '해당 가챠의 추가 물량이 확인되어 재입고 되었습니다. 많은 관심 부탁드립니다.',
    list: ['리락쿠마 동글동글 동물들 2탄', '포켓몬 해양생물 시리즈 3탄'],
  },
  {
    num: 13,
    title: '[예약] 넥스트가챠 11월 예약 판매 안내',
    created_at: '2025-11-12 12:00:00',
    content:
      '2026년 2월 출시 예정 가챠의 예약 판매가 시작되었습니다. 한정 수량으로 준비된 이번 제품을 놓치지 마세요!',
    list: ['치이카와 산리오 콜라보 1탄', '산리오 주먹밥 메지루시'],
  },
  {
    num: 12,
    title: '[이벤트] 넥스트가챠 11월 이벤트 안내',
    created_at: '2025-11-01 12:00:00',
    content:
      '2025년 11월 한 달간 한번에 3만원 이상 구매 시 치이카와, 산리오, 다마고치 총 3종류 중 랜덤으로 가챠를 증정하는 이벤트가 진행됩니다. 많은 참여 부탁드립니다.₩n+ 재고 소진 시 이벤트는 조기 종료됩니다.',
  },
  {
    num: 11,
    title: '[신상] 넥스트가챠 11월 신상 가챠',
    created_at: '2025-11-01 12:00:00',
    content:
      '2025년 11월 신상 가챠가 출시되었습니다. 인기 캐릭터와 애니메이션을 테마로 한 다양한 제품이 준비되어 있습니다. 지금 바로 확인해보세요!',
    list: [
      '치이카와 우물우물 파티 3탄',
      '치이카와 나란히 2탄',
      '다마고치 메지루시 2탄',
    ],
  },
  {
    num: 10,
    title: '[공지] 10월 이벤트 결과 안내',
    created_at: '2025-11-01 12:00:00',
    content:
      '아래 10분이 당첨 되어 1000p가 적립되었습니다. 참여해주신 모든 분들께 감사드립니다.',
    list: [
      'user01',
      'user02',
      'user03',
      'user04',
      'user05',
      'user06',
      'user07',
      'user08',
      'user09',
      'user10',
    ],
  },
  {
    num: 9,
    title: '[추가] 넥스트가챠 10월 추가 신상 가챠',
    created_at: '2025-10-20 12:00:00',
    content:
      '해당 가챠의 추가 물량이 확인되어 재입고 되었습니다. 많은 관심 부탁드립니다.',
    list: ['리락쿠마 동글동글 동물들 2탄', '포켓몬 해양생물 시리즈 3탄'],
  },
  {
    num: 8,
    title: '[예약] 넥스트가챠 10월 예약 판매 안내',
    created_at: '2025-10-12 12:00:00',
    content:
      '2026년 1월 출시 예정 가챠의 예약 판매가 시작되었습니다. 한정 수량으로 준비된 이번 제품을 놓치지 마세요!',
    list: ['치이카와 산리오 콜라보 1탄', '산리오 주먹밥 메지루시'],
  },
  {
    num: 7,
    title: '[이벤트] 넥스트가챠 10월 이벤트 안내',
    created_at: '2025-10-01 12:00:00',
    content:
      '2025년 10월 한 달간 넥스트가챠에 후기를 남겨주신 10분을 뽑아 1000p를 드리는 이벤트가 진행됩니다. 많은 참여 부탁드립니다.',
  },
  {
    num: 6,
    title: '[신규] 넥스트가챠 10월 신상 가챠',
    created_at: '2025-10-01 12:00:00',
    content:
      '2025년 10월 신상 가챠가 출시되었습니다. 인기 캐릭터와 애니메이션을 테마로 한 다양한 제품이 준비되어 있습니다. 지금 바로 확인해보세요!',
    list: [
      '치이카와 우물우물 파티 3탄',
      '치이카와 나란히 2탄',
      '다마고치 메지루시 2탄',
    ],
  },
  {
    num: 5,
    title: '추석 연휴 배송 안내',
    created_at: '2025-09-29 12:00:00',
    content:
      '다가오는 추석 연휴로 인해 배송 일정에 변동이 있을 수 있습니다. 2025년 10월 2일(목)부터 2025년 10월 9일(목) 사이에 주문한 제품은 택바사의 사정으로 인해 배송이 지연될 수 있습니다. 고객 여러분의 양해 부탁드립니다.',
  },
  {
    num: 4,
    title: '[이벤트] 반다이 포인트 추가 적립 이벤트',
    created_at: '2025-09-29 12:00:00',
    content:
      '2025년 10월 1일 ~ 2025년 10월 31일 한 달간 반다이 회사 제품 5개 이상 구매 시 포인트가 최대 500p 적립되는 이벤트가 진행됩니다. 넥스트가챠에서 반다이 제품을 구매하시고 더 많은 혜택을 누리세요!',
    link: 'https://nextgacha.vercel.app/search?type=series&company=bandai',
  },
  {
    num: 3,
    title: '[예약] 넥스트가챠 9월 예약 판매 안내',
    created_at: '2025-09-12 12:00:00',
    content:
      '2025년 12월 출시 예정 가챠의 예약 판매가 시작되었습니다. 한정 수량으로 준비된 이번 제품을 놓치지 마세요!',
    list: ['치이카와 산리오 콜라보 1탄', '산리오 주먹밥 메지루시'],
  },
  {
    num: 2,
    title: '[신규] 넥스트가챠 9월 신상 가챠',
    created_at: '2025-09-01 12:00:00',
    content:
      '2025년 9월 신상 가챠가 출시되었습니다. 인기 캐릭터와 애니메이션을 테마로 한 다양한 제품이 준비되어 있습니다. 지금 바로 확인해보세요!',
    list: [
      '치이카와 우물우물 파티 3탄',
      '치이카와 나란히 2탄',
      '다마고치 메지루시 2탄',
    ],
  },
  {
    num: 1,
    title: '넥스트가챠 오픈 이벤트 안내',
    created_at: '2025-09-01 12:00:00',
    content:
      '2025년 9월 1일부터 30일까지 넥스트가챠 오픈 이벤트가 진행됩니다.\n기간 내에 가챠를 구매하시는 모든 분들께 추첨을 통해 특별한 경품을 드립니다. 많은 참여 부탁드립니다.',
  },
];

const GUIDE = {
  title: '넥스트가챠 사용 안내',
  created_at: '2025-08-10 12:00:00',
  content: '넥스트 가챠는 되팔이 방지를 위해 한번에 5개까지만 구매할 수 있고, 배송이 완료되기 전까지 같은 제품을 구매할 수 없는 구조로 되어있습니다.\n우리 모두 행복한 덕질 생활을 위한 정책이므로 양해부탁드리겠습니다.\n적립포인트는 택배 배송 완료 후 적립될 예정입니다.\n5만원 이상 구매 시 배송비가 무료입니다. 또한, 구매 후 7일 이내에 반품 및 교환이 가능합니다.\n현재 보안을 위해 로그인은 카카오, 구매는 토스페이를 통해서만 가능합니다.\n신상 가챠는 매월 1일에 예약 가챠는 매월 12일에 추가됩니다만, 깜짝 추가 가챠가 들어올 수 있습니다.\n앞으로도 더 나은 서비스로 찾아뵙겠습니다. 감사합니다!',
};

// 제목으로 분류 추정
const categoryOf = (title) => (/이벤트/.test(title) ? 'event' : /배송/.test(title) ? 'ship' : /점검/.test(title) ? 'check' : 'notice');

const toDoc = (n, num, pinned) => ({
  num,
  category: categoryOf(n.title),
  title: n.title.trim(),
  content: n.content,
  ...(Array.isArray(n.list) && { list: n.list }),
  pinned,
  state: 'published',
  publish_at: n.created_at.slice(0, 16),
  created_at: n.created_at,
  updated_at: n.created_at,
});

const client = new MongoClient(process.env.MONGODB_URI);
try {
  const db = client.db(dbName);
  const notice = db.collection('notice');
  if (await notice.estimatedDocumentCount()) {
    console.log(`${dbName}.notice에 이미 공지가 있어서 건너뛰어요.`);
  } else {
    const maxNum = Math.max(...legacy.map((n) => n.num));
    const docs = [...legacy.map((n) => toDoc(n, n.num, false)), toDoc(GUIDE, maxNum + 1, true)];
    await notice.insertMany(docs);
    await notice.createIndex({ num: 1 }, { unique: true });
    await db.collection('counter').updateOne({ id: 'notice' }, { $max: { num: maxNum + 1 } }, { upsert: true });
    console.log(`${dbName}.notice에 공지 ${docs.length}개를 넣었어요. 다음 번호는 ${maxNum + 2}.`);
  }
} finally {
  await client.close();
}
