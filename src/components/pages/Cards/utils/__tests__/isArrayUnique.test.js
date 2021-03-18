import isArrayUnique from '../isArrayUnique';

it('should return true', () => {
  const result = isArrayUnique([1, 2, 3]);
  expect(result).toBeTruthy();
});

it('should return false', () => {
  const result = isArrayUnique([1, 1, 2]);
  expect(result).toBeFalsy();
});
