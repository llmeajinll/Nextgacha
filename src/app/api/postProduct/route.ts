import { NextResponse } from 'next/server';
import { productColl, counterColl, mongodbClient } from '@/lib/mongodb';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  // const { data } = await req.json();
  // console.log(data);

  const formData = await req.formData();

  // console.log('Received Form Data Entries:');
  // for (const pair of formData.entries()) {
  //   console.log(`${pair[0]}: ${pair[1]}`);
  // }

  const title = formData.get('title') as string;
  const price = Number(formData.get('price'));
  const company = formData.get('company') as string;
  const group = JSON.parse(formData.get('group') as string);
  const list = JSON.parse(formData.get('list') as string);
  const create = formData.get('create')
    ? new Date(formData.get('create') as string)
    : '';
  const reserve = formData.get('reserve')
    ? new Date(formData.get('reserve') as string)
    : '';
  const img = formData.get('image') as File;
  let image: string = '';

  const mongodbSession = mongodbClient.startSession();

  try {
    const result = await mongodbSession.withTransaction(async () => {
      // product counter 증가
      async function getNextSequence() {
        const num = counterColl
          .findOneAndUpdate(
            { id: 'num' },
            { $inc: { num: 1 } },
            { returnDocument: 'after', upsert: true, session: mongodbSession }
          )
          .then((result) => {
            // console.log('result:', result);
            return result?.num;
          })
          .catch((error) => {
            console.error('Error getting next sequence:', error);
            return null;
          });
        return num;
      }

      const counter = await getNextSequence();
      // console.log('counter:', counter);

      if (counter === null) {
        return NextResponse.json(
          { message: 'Failed to get next sequence number' },
          { status: 500 }
        );
      }

      // 이미지가 있으면 storage image에 추가
      if (img) {
        const { url } = await put(`images/${counter}.png`, img, {
          access: 'public',
        })
          .then((res) => {
            // console.log('Blob upload result:', res);
            return res;
          })
          .catch((err) => {
            console.error('Error uploading image to blob storage:', err);
            return NextResponse.json(
              { message: 'Failed to save image' },
              { status: 500 }
            );
          });
        image = url;
      }

      const insertData = {
        title,
        image: [
          counter !== null
            ? `${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${counter}.png`
            : undefined,
        ],
        price,
        create,
        reserve,
        list,
        company,
        group,
        created_at: new Date(),
        num: counter,
      };

      // productCollection에 값 추가
      const result = await productColl
        .insertOne(insertData, { session: mongodbSession })
        .then((res) => {
          // console.log('Insert Result:', res);
          return res.acknowledged;
        })
        .catch((err) => {
          console.error('Error inserting product:', err);
          return NextResponse.json(
            { message: 'Failed to insert product' },
            { status: 500 }
          );
        });

      if (result === true) {
        return NextResponse.json(
          { message: 'Product inserted successfully', url: image },

          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { message: 'Failed to insert product' },
          { status: 500 }
        );
      }
    });

    console.log('postProduct result : ', result);
    if (result.status === 201) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false });
    }
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
}
