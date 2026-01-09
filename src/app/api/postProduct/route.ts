import { NextResponse } from 'next/server';
import { productColl, counterColl } from '@/lib/mongodb';
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
  let image = null;

  function getNextSequence() {
    const num = counterColl
      .findOneAndUpdate(
        { id: 'num' },
        { $inc: { num: 1 } },
        { returnDocument: 'after', upsert: true }
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

  if (!img) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  } else {
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
    image: [image],
    price,
    create,
    reserve,
    list,
    company,
    group,
    created_at: new Date(),
    num: counter,
  };
  const result = await productColl
    .insertOne(insertData)
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
}
