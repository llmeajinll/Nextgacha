import { MongoClient } from 'mongodb';
// import mongoose from 'mongoose';

const url: string = process.env.MONGODB_URI!;

if (!url) {
  throw new Error('환경변수 x');
}

const options: any = {};
let connectDB: Promise<MongoClient>;

connectDB = new MongoClient(url, options).connect();

const client = await connectDB;
const productDB = client.db('gacha').collection('product');

// console.log(productDB);

export { productDB };
