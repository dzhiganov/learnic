import getUniqNumbers from '../getUniqNumbers';
import getVariants from '../getVariants';

jest.mock('../getUniqNumbers', () => jest.fn());

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
  getUniqNumbers.mockImplementation(() => [0, 1, 2]);
  const result = getVariants(mockData, 'word', 'test4');

  expect(result).toMatchInlineSnapshot(`
    Array [
      "test1",
      "test2",
      "test3",
    ]
  `);

  getUniqNumbers.mockReset();
});

it('if words is null should return array of strings', () => {
  const result = getVariants(null);

  expect(result).toMatchInlineSnapshot(`
    Array [
      "",
      "",
      "",
    ]
  `);
});

it('if words is empty should return array of strings', () => {
  const result = getVariants([]);

  expect(result).toMatchInlineSnapshot(`
    Array [
      "",
      "",
      "",
    ]
  `);
});

it('if words is not valid should return array of strings', () => {
  const result = getVariants([
    ...mockData,
    {
      someProp: 'value',
    },
  ]);

  expect(result).toMatchInlineSnapshot(`
    Array [
      "",
      "",
      "",
    ]
  `);
});

it('if words is not array should return array of strings', () => {
  const result = getVariants({ someProp: 'someValue' });

  expect(result).toMatchInlineSnapshot(`
    Array [
      "",
      "",
      "",
    ]
  `);
});
