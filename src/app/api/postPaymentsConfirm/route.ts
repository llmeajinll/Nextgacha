import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { mongodbClient } from '@/lib/mongodb';
import { validateStock } from '@/lib/validateStock';
import { reduceStock } from '@/lib/reduceStock';
import { addOrder } from '@/lib/addOrder';
import { resetCart } from '@/lib/resetCart';

export async function POST(req: Request) {
  const { paymentKey, orderId, amount, list, address } = await req.json();
  const session = await auth();
  const email = session?.user?.email;
  const mongodbSession = mongodbClient.startSession();

  if (!email) {
    return NextResponse.json(
      { message: '로그인이 되어있지 않습니다.', ok: false },
      { status: 400 }
    );
  }

  console.log(
    'paymentKey, orderId, amount, list, address : ',
    paymentKey,
    orderId,
    amount,
    list,
    address
  );

  // 1. [최종 재고 확인] DB에서 수량을 다시 확인
  const isStillAvailable = await validateStock(list);
  if (isStillAvailable.isAvailable === false) {
    return NextResponse.json(
      { message: '결제 진행 중 품절되었습니다.', ok: false },
      { status: 400 }
    );
  }

  // 2. [Toss 승인 API 호출] 여기서 실제로 돈이 정산됩니다.
  const secretKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_SECRET_KEY;
  const basicToken = Buffer.from(`${secretKey}:`).toString('base64');

  //   console.log('basicToken : ', basicToken);

  const confirmRes = await fetch(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    }
  );

  const data = await confirmRes.json();

  //   console.log('confirmRes : ', data.status);
  //   return NextResponse.json({ status: confirmRes.status, ok: true });

  if (data.status === 'DONE') {
    // 3. [최종 처리] DB에서 재고를 깎고 결제 완료 처리
    try {
      await mongodbSession.withTransaction(async () => {
        const reduceStockRes = await reduceStock({
          list,
          email,
          mongodbSession,
        });
        const addOrderRes = await addOrder({
          orderId,
          list,
          amount,
          email,
          mongodbSession,
          address,
        });
        const resetCartRes = await resetCart({
          email,
          mongodbSession,
        });
        console.log(
          'addOrderRes?.acknowledged, reduceStockRes?.ok : ',
          addOrderRes?.acknowledged,
          reduceStockRes?.ok,
          resetCartRes?.ok,
          addOrderRes?.acknowledged && reduceStockRes?.ok && resetCartRes?.ok
        );
      });

      return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err) {
      console.error('트랜잭션 실패! 모든 작업이 취소되었습니다:', err);
      return NextResponse.json(
        {
          message: `오류가 발생하였습니다.`,
          ok: false,
        },
        { status: 400 }
      );
    } finally {
      await mongodbSession.endSession(); // 3. 세션 종료 (필수)
    }
  } else {
    return NextResponse.json(
      { message: '결제 과정에서 오류가 발생하였습니다.', ok: false },
      { status: 500 }
    );
  }
}
