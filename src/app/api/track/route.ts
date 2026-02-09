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
          params[key] = decodeURIComponent(
            String(value ?? '').replaceAll('+', ' ') || '',
          );
        }

        console.log('key:', key, 'value:', value, 'params:', params);
      });
    }

    // --- 상황 A: 검색 페이지인 경우 ---
    if (
      segments[0] === 'search' &&
      (params.type === 'ani' ||
        params.type === 'character' ||
        params.detail === '오네무탄' ||
        params.detail === '메지루시')
    ) {
      const result = await pageViewsColl.updateOne(
        {
          page: 'search',
          'params.detail': params.detail,
        }, // 동일한 검색 조건이 있는지 확인
        {
          $inc: { [`params.filter.${params.filter}`]: 1 }, // 있으면 1 증가
          $set: {
            lastVisit: koreaTime,
            'params.detail': params.detail,
          },
          $setOnInsert: {
            created_at: koreaTime,
          },
        },
        { upsert: true },
      );

      console.log(result);

      // --- 상황 B: tag 검색일 경우 ---
    } else if (segments[0] === 'search' && params.tag !== '') {
      const result = await pageViewsColl.updateOne(
        {
          page: 'search',
          'params.tag': params.tag,
        }, // 동일한 검색 조건이 있는지 확인
        {
          $inc: { [`params.page.${params.page}`]: 1 }, // 있으면 1 증가
          $set: {
            lastVisit: koreaTime,
            'params.tag': params.tag,
          },
          $setOnInsert: {
            created_at: koreaTime,
          },
        },
        { upsert: true },
      );

      console.log(result);
    }

    // --- 상황 C: 상품 페이지(숫자)인 경우 ---
    else if (!isNaN(Number(segments[0]))) {
      const code = Number(segments[0]);
      const tabName = segments[1] || 'info';

      const result = await pageViewsColl.updateOne(
        { page: code },
        {
          $inc: { [`tab.${tabName}`]: 1 }, // tab 객체 내부의 해당 탭 숫자만 1 증가
          $set: { lastVisit: koreaTime },
          $setOnInsert: { created_at: koreaTime },
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

// type=main&tag=전체%20상품&page=1
