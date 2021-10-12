import Words from '../../models/Words';
import { getArrayOfWord } from '../../utils/getMockWords';

jest.mock('../../database');

beforeEach(() => {
  jest.clearAllMocks();
});

const RealDate = Date.now;

beforeAll(() => {
  global.Date.now = () => new Date('2021-05-11').getTime();
});

afterAll(() => {
  global.Date.now = RealDate;
});

describe('Testing Words methods', () => {
  test('Words.getWords should return array of words', async () => {
    const result = await Words.getWords('1');

    expect(result).toMatchObject(
      getArrayOfWord(
        '1 | fish   | fish   | 2021.12.12 | 2021.12.12 | 0 | noun | Fish bubbles | bubble.mp3',
        '2 | cat    | cat    | 2021.11.12 | 2021.11.12 | 1 | noun | Cat meows    | meow.mp3',
        '3 | dog    | dog    | 2021.10.12 | 2021.10.12 | 2 | noun | Dog barks    | bark.mp3',
        '0 | rabbit | rabbit | 2021.01.12 | 2021.01.12 | 3 | noun | Rabbit runs  | run.mp3'
      )
    );
  });

  test('Words.getWords should return only training words', async () => {
    const result = await Words.getWords('1', true);

    expect(result).toMatchObject(
      getArrayOfWord(
        '1 | fish   | fish   | 2021.12.12 | 2021.12.12 | 0 | noun | Fish bubbles | bubble.mp3',
        '0 | rabbit | rabbit | 2021.01.12 | 2021.01.12 | 3 | noun | Rabbit runs  | run.mp3'
      )
    );
  });

  test('Words.getExamples should get examples and audio from word definition', async () => {
    const result = Words.getExamples([
      {
        meanings: [
          {
            definitions: [{ example: 'Cat meows' }, { example: 'Cat walks' }],
          },
        ],
        phonetics: [{ audio: 'meow.mp3' }],
      },
    ]);

    expect(result).toMatchObject({
      examples: ['Cat meows', 'Cat walks'],
      audio: 'meow.mp3',
    });
  });
});
