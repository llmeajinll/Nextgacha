export function comma(num: number | string): string {
  if (typeof num === 'number') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
