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
const mongodbClient = new MongoClient(url, options);

let connectDB: Promise<MongoClient>;
connectDB = mongodbClient.connect();

const client = await connectDB;
const gachaDB = client.db('gacha');

const pageViewsColl = gachaDB.collection('page_views');

const cartColl = gachaDB.collection('cart');
const productColl = gachaDB.collection('product');
const qnaColl = gachaDB.collection('qna');
const reviewColl = gachaDB.collection('review');
const orderColl = gachaDB.collection('order');
const counterColl = gachaDB.collection('counter');
const userColl = gachaDB.collection('user');
const errorColl = gachaDB.collection('error');

// console.log(productDB);

export {
  mongodbClient,
  gachaDB,
  pageViewsColl,
  cartColl,
  productColl,
  qnaColl,
  reviewColl,
  orderColl,
  counterColl,
  userColl,
  errorColl,
};
