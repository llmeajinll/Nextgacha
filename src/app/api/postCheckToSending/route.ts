import { NextResponse } from 'next/server';
import { orderColl } from '@/lib/mongodb';
import { validateStock } from '@/lib/validateStock';

export async function POST(req: Request) {
  const data = await req.json();

  const { send } = data;

  // 한개
  if (send === 'one') {
    const { send, orderId, courier, invoice } = data;
    console.log(send, orderId, courier, invoice);
    try {
      const result = await orderColl.updateOne(
        {
          orderId,
        },
        {
          $set: {
            courier,
            invoice,
            status: '배송중',
          },
        }
      );
      console.log(result);
      return NextResponse.json({ ok: true, result }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ ok: true, result: {} }, { status: 200 });
    }
  }
  // 여러개
  else if (send === 'many') {
    const { orders } = data;
    try {
      const operations = orders.map((order: any) => ({
        updateOne: {
          filter: { orderId: order.orderId },
          update: {
            $set: {
              courier: order.courier,
              invoice: order.invoice,
              status: '배송중',
            },
          },
        },
      }));

      const result = await orderColl.bulkWrite(operations);

      console.log(
        `${result.modifiedCount}개의 주문 정보가 업데이트되었습니다.`
      );
      return NextResponse.json({ ok: true, result }, { status: 200 });
    } catch (error) {
      console.error('주문 업데이트 중 에러 발생:', error);
      return NextResponse.json({ ok: false, result: {} }, { status: 400 });
    }
  }

  // 환불
  else if (send === 'refund') {
    const { send, reason, orderId } = data;
    console.log(send, reason);
    try {
      const result = await orderColl.updateOne(
        {
          orderId,
        },
        {
          $set: {
            reason,
            status: '환불',
          },
        }
      );
      console.log(result);
      return NextResponse.json({ ok: true, result }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ ok: true, result: {} }, { status: 200 });
    }
  }
}
