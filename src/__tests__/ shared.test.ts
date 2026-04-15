import { comma } from '@/shared/comma';
// import {formatDate} from '@/shared/formatDate';

describe('shared', () => {
  (test('number 콤마 추가해주는지 테스트', () => {
    expect(comma(123456789)).toBe('123,456,789');
  }),
    test('string 콤마 추가해주는지 테스트', () => {
      expect(comma('123456789')).toBe('123,456,789');
    }),
    test('string에 이미 콤마가 있는 경우 테스트', () => {
      expect(comma('123,456,789')).toBe('123,456,789');
    }));
});
