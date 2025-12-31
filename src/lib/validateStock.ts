import { productColl } from '@/lib/mongodb';

export async function validateStock(list: any[]) {
  // const { list } = await req.json();
  //   console.log('validateStock : ', list);
  const dbDocs = await productColl
    .find({ num: { $in: list.map((i: any) => i.num) } })
    .project({ num: 1, 'list.code': 1, 'list.count': 1, 'list.name': 1 })
    .toArray();

  const docMap = new Map(dbDocs.map((doc) => [doc.num, doc]));

  for (const item of list) {
    const parentDoc = docMap.get(item.num);
    if (!parentDoc) return { message: '상품 없음', isAvailable: false };

    for (const p of item.product) {
      const actual = parentDoc.list.find((li: any) => li.name === p.name);
      //   console.log('num', item.num, 'actual : ', actual, 'p : ', p);
      if (!actual || actual.count < p.count) {
        return { message: '재고 부족', isAvailable: false };
      }
    }
  }
  return { isAvailable: true };
}
