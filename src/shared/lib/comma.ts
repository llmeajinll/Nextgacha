export function comma<T>(num: T) {
  if (typeof num === 'number') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else if (typeof num === 'string') {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '';
  }
}
