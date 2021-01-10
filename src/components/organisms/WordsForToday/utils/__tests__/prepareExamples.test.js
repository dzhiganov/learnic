import prepareExamples from '../prepareExamples';

const mockData = [
  {
    meanings: [
      {
        definitions: [{ example: 'test1' }],
      },
    ],

    phonetics: [
      {
        audio: 'https://test-audio-link.mp3',
      },
    ],

    word: 'test1',
  },
];

it('should return prepared examples', () => {
  const result = prepareExamples(mockData);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "audio": "https://test-audio-link.mp3",
      "examples": Array [
        "test1",
      ],
    }
  `);
});
