import getUniqNumbers from './getUniqNumbers';
import isArrayUnique from './isArrayUnique';

const mockData = Array(100).fill('someValue');

it('get uniq array indexes', () => {
  const result = getUniqNumbers(mockData);

  expect(isArrayUnique(result)).toBeTruthy();
});
