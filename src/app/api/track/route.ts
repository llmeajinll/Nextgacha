import { NextResponse } from 'next/server';
import { pageViewsColl } from '@/lib/mongodb';
import { koreaTime } from '@/shared/koreaTime';

export async function POST(req: Request) {
  try {
    const { page, param, referrer, userAgent } = await req.json();

    console.log(
      '=========== track console : ',
      page,
      param,
      referrer,
      userAgent,
    );

    let params: Record<string, string> = {};
    let tab;

    const segments = page.split('/').filter(Boolean);

    if (segments[1]) {
      console.log('isSecondUrl');
    }

    if (param !== '') {
      console.log('isparams');
      const pairs = param.slice(1).split('&').filter(Boolean);

      pairs.forEach((pair: string) => {
        // 2. '='를 기준으로 키와 값 분리
        const [key, value] = pair.split('=');

        if (key) {
          // 3. 디코딩하여 한글 깨짐 방지 및 객체에 할당
          params[key] = decodeURIComponent(value || '');
        }
      });
    }

    // 2. 첫 번째 세그먼트가 숫자인지 확인 (예: "27" -> 27)

    const getTab = () => {
      const firstSegmentAsNumber = Number(segments[0]);
      const isProductPage =
        !isNaN(firstSegmentAsNumber) && segments.length >= 1;

      if (isProductPage) {
        return segments[1];
      }
      return '';
    };

    // await pageViewsColl.updateOne(
    //   { page: segments[0], params, timestamp: new Date(), tab: getTab() },
    //   {
    //     $inc: { count: 1 },
    //     $set: { lastVisit: new Date() },
    //   },
    //   { upsert: true },
    // );

    // const now = new Date();

    // --- 상황 A: 검색 페이지인 경우 ---
    if (segments[0] === 'search') {
      const result = await pageViewsColl.updateOne(
        {
          page: 'search',
          'params.type': params.type,
          'params.detail': params.detail,
        }, // 동일한 검색 조건이 있는지 확인
        {
          $inc: { count: 1 }, // 있으면 1 증가
          $set: {
            params: params,
            lastVisit: koreaTime,
          },
          $setOnInsert: { timestamp: koreaTime }, // 처음 생성될 때만 기록
        },
        { upsert: true },
      );

      console.log(result);
    }

    // --- 상황 B: 상품 페이지(숫자)인 경우 ---
    else if (!isNaN(Number(segments[0]))) {
      const code = segments[0];
      const tabName = segments[1] || 'info';

      const result = await pageViewsColl.updateOne(
        { page: code },
        {
          $inc: { [`tab.${tabName}`]: 1 }, // tab 객체 내부의 해당 탭 숫자만 1 증가
          $set: { lastVisit: koreaTime },
          $setOnInsert: {
            timestamp: koreaTime,
            tab: { info: 0, qna: 0, review: 0 }, // 처음 생성 시 기본 구조 세팅
          },
        },
        { upsert: true },
      );

      console.log(result);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
