import mockedFetch from 'node-fetch';
import Dictionary from '../../models/Dictionary';

const mockResponse = [
  {
    word: 'cat',
    phonetics: [{ text: 'cat', audio: 'meow' }],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          { definition: 'animal', example: 'cat', synonyms: ['other cat'] },
        ],
      },
    ],
  },
];

describe('Testing Dictionary methods', () => {
  test('Dictionary.getDefinition should return word definition', async () => {
    ((mockedFetch as unknown) as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ json: () => mockResponse })
    );

    const result = await Dictionary.getDefinition('cat');

    expect(mockedFetch).toBeCalled();
    expect(result).toBe(mockResponse);
  });
});
