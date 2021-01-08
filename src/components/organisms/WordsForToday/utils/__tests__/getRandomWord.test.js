import random from 'lodash.random';
import getRandomWord from '../getRandomWord';

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

it('get random word', () => {
  const randomIndex = 1;
  random.mockImplementation(() => randomIndex);
  const result = getRandomWord(mockData);
  const expected = {
    randomWord: mockData[randomIndex].word,
    randomTranslate: mockData[randomIndex].translate,
  };

  expect(result).toEqual(expected);
  expect(random).toHaveBeenCalledTimes(1);

  random.mockReset();
});
