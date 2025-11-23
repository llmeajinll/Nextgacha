import { NextResponse } from 'next/server';
import { userColl } from '@/lib/mongodb';

export async function POST(req: Request) {
  const data = await req.json();
  console.log('data : ', data);
  const { email, num, updatedArray } = data;
  console.log('email, num, updatedArray : ', email, num, updatedArray);

  //   { name: string; code: string; count: number }[] | undefined }

  const user = await userColl.findOne({ email: data.email });
  const foundCart = user?.cart.find((item: any) => item.num === num);
  const product = foundCart?.product || [];

  console.log('find product: ', product);

  const newArray =
    product.length === 0
      ? updatedArray
      : (() => {
          updatedArray.forEach((updatedItem: any) => {
            const existingItem = product.find(
              (item: any) => item.code === updatedItem.code
            );
            if (existingItem) {
              existingItem.count += updatedItem.count; // count 합치기
            } else {
              product.push(updatedItem); // 새 항목 추가
            }
          });
          return product;
        })();

  console.log('newArray : ', newArray);

  const result =
    product.length === 0
      ? await userColl.updateOne({ email }, {
          $push: { cart: { num, product: newArray } },
        } as any)
      : await userColl.updateOne(
          { email, 'cart.num': num },
          {
            $set: {
              'cart.$.product': newArray,
            },
          }
        );

  console.log('result: ', result);

  return NextResponse.json({ ok: true, result });
}

//   const result = await userColl.updateOne(
//     { email: data.email, 'cart.num': data.num },
//     { $set: { 'cart.$.product': data.updatedArray } }
//   );

// console.log('product : ', product);

//   return NextResponse.json({ ok: true });
