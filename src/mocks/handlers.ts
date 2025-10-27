import { http, HttpResponse } from 'msw';

const baseUrl = 'http://localhost:3000';

export const handlers = [
  http.get(`${baseUrl}/api/postProductList`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json({
      title: '치이카와 우물우물파티 3탄',
      id: 'chiikawa_mogumogu_num3',
      manufacturer: '반다이',
      price: 4000,
      point: 40,
      count: 5,
      list: [
        {
          name: '치이카와',
          code: 'ban3_1',
          count: 1,
          price: 4000,
          title: '치이카와 우물우물파티 3탄',
        },
        {
          name: '하치와레',
          code: 'ban3_2',
          count: 0,
          price: 4000,
          title: '치이카와 우물우물파티 3탄',
        },
        {
          name: '우사기',
          code: 'ban3_3',
          count: 1,
          price: 4000,
          title: '치이카와 우물우물파티 3탄',
        },
        {
          name: '밤만쥬',
          code: 'ban3_4',
          count: 1,
          price: 4000,
          title: '치이카와 우물우물파티 3탄',
        },
        {
          name: '모몬가',
          code: 'ban3_5',
          count: 1,
          price: 4000,
          title: '치이카와 우물우물파티 3탄',
        },
      ],
    });
  }),
];
