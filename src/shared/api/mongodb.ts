import { MongoClient } from 'mongodb';
// import mongoose from 'mongoose';

const url: string = process.env.MONGODB_URI!;

if (!url) {
  throw new Error('환경변수 x');
}

const mongodbClient = new MongoClient(url);

const client = await mongodbClient.connect();
// 운영은 gacha, 로컬·Preview는 MONGODB_DB=gacha_dev (같은 클러스터, DB만 분리)
// ponytail: 같은 계정이라 개발 환경에서도 운영 DB 접근 가능, 완전 분리는 별도 클러스터/계정
const gachaDB = client.db(process.env.MONGODB_DB ?? 'gacha');


const cartColl = gachaDB.collection('cart');
const productColl = gachaDB.collection('product');
const qnaColl = gachaDB.collection('qna');
const reviewColl = gachaDB.collection('review');
const orderColl = gachaDB.collection('order');
const counterColl = gachaDB.collection('counter');
const userColl = gachaDB.collection('user');
const errorColl = gachaDB.collection('error');
// 쇼핑몰 메인 상단 배너 (관리자 배너 관리)
const bannerColl = gachaDB.collection('banner');
// 쇼핑몰 공지 (관리자 공지 관리). 번호는 counterColl { id: 'notice' }
const noticeColl = gachaDB.collection('notice');
// 문서 하나(_id 'menu')에 헤더 카테고리 메뉴 전체를 저장
const categoryColl = gachaDB.collection<{ _id: string; [key: string]: any }>('category');

// console.log(productDB);

export {
  mongodbClient,
  gachaDB,
  cartColl,
  productColl,
  qnaColl,
  reviewColl,
  orderColl,
  counterColl,
  userColl,
  errorColl,
  bannerColl,
  noticeColl,
  categoryColl,
};
