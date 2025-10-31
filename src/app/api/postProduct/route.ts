import { NextResponse } from 'next/server';
import { productColl, counterColl } from '@/lib/mongodb';
import { error } from 'console';
import { title } from 'process';

export async function POST(req: Request) {
  const { data } = await req.json();
  console.log(data);

  function getNextSequence(): Promise<number | null> {
    const num = counterColl
      .findOneAndUpdate(
        { id: 'num' },
        { $inc: { num: 1 } },
        { returnDocument: 'after', upsert: true }
      )
      .then((result) => {
        console.log('result:', result);
        return result?.num;
      })
      .catch((error) => {
        console.error('Error getting next sequence:', error);
        return null;
      });
    return num;
  }

  const counter = await getNextSequence();
  console.log('counter:', counter);

  if (counter === null) {
    return NextResponse.json(
      { message: 'Failed to get next sequence number' },
      { status: 500 }
    );
  } else {
    console.log('Next sequence number obtained successfully');
    const insertData = {
      title: data.title,
      create: new Date(),
      num: counter,
    };
    await productColl
      .insertOne(insertData)
      .then((result) => {
        console.log('Insert Result:', result);
        return NextResponse.json(
          { message: 'Product inserted successfully' },
          { status: 201 }
        );
      })
      .catch((error) => {
        console.error('Error inserting product:', error);
        return NextResponse.json(
          { message: 'Failed to insert product' },
          { status: 500 }
        );
      });
  }

  return NextResponse.json(
    { message: 'Failed to insert product' },
    { status: 500 }
  );
}
