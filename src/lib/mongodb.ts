import { MongoClient } from 'mongodb';
// import mongoose from 'mongoose';

interface CounterType {
  _id: string;
  num: number;
}

const url: string = process.env.MONGODB_URI!;

if (!url) {
  throw new Error('환경변수 x');
}

const options: any = {};
let connectDB: Promise<MongoClient>;

connectDB = new MongoClient(url, options).connect();

const client = await connectDB;
const gachaDB = client.db('gacha');

const productColl = gachaDB.collection('product');
const qnaColl = gachaDB.collection('qna');
const reviewColl = gachaDB.collection('review');
const orderColl = gachaDB.collection('order');
const counterColl = gachaDB.collection('counter');
const userColl = gachaDB.collection('user');

// console.log(productDB);

export {
  gachaDB,
  productColl,
  qnaColl,
  reviewColl,
  orderColl,
  counterColl,
  userColl,
};
