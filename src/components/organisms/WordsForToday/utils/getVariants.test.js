import random from 'lodash.random';
import getVariants, { anotherVariantsCount } from './getVariants';

jest.mock('lodash.random', () => jest.fn());

const mockData = [
  {
    word: 'test1',
    translate: 'test1',
  },
  {
    word: 'test2',
    translate: 'test2',
  },
  {
    word: 'test3',
    translate: 'test3',
  },
  {
    word: 'test4',
    translate: 'test4',
  },
];

it('get random variants', () => {
  const randomIndex = 1;
  random.mockImplementation(() => randomIndex);
  const result = getVariants(mockData);
  const expected = Array(anotherVariantsCount)
    .fill(mockData[randomIndex])
    .map(({ translate }) => translate);

  expect(result).toEqual(expected);
  expect(random.mock.calls).toEqual(
    Array(anotherVariantsCount).fill([0, mockData.length - 1])
  );
  expect(random).toHaveBeenCalledTimes(anotherVariantsCount);

  random.mockReset();
});

it('if words is null should return array of strings', () => {
  const result = getVariants(null);
  const expected = Array(anotherVariantsCount).fill('');

  expect(result).toEqual(expected);
});

it('if words is empty should return array of strings', () => {
  const result = getVariants([]);
  const expected = Array(anotherVariantsCount).fill('');

  expect(result).toEqual(expected);
});

it('if words is not valid should return array of strings', () => {
  const result = getVariants([
    ...mockData,
    {
      someProp: 'value',
    },
  ]);
  const expected = Array(anotherVariantsCount).fill('');

  expect(result).toEqual(expected);
});

it('if words is not array should return array of strings', () => {
  const result = getVariants({ someProp: 'someValue' });
  const expected = Array(anotherVariantsCount).fill('');

  expect(result).toEqual(expected);
});
