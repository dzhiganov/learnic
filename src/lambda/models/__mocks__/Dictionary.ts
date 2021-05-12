import type { Response } from '../Dictionary';

const mock = {
  en: {
    cat: [
      {
        word: 'cat',
        phonetics: [{ text: 'cat', audio: 'meow.mp3' }],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              { definition: 'Animal', example: 'Cat meows', synonyms: [] },
            ],
          },
        ],
      },
    ],
    dog: [
      {
        word: 'dog',
        phonetics: [{ text: 'dog', audio: 'bark.mp3' }],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              { definition: 'Animal', example: 'Dog barks', synonyms: [] },
            ],
          },
        ],
      },
    ],
  },
};

const hasOwnProperty = <T>(obj: T, key: PropertyKey): key is keyof T =>
  Object.prototype.hasOwnProperty.call(obj, key);

export default {
  getDefinition: (word: string, lang = 'en'): Promise<Response> => {
    if (!hasOwnProperty<typeof mock>(mock, lang)) {
      throw new Error(`Lang ${lang} is not defined`);
    }

    const words = mock[lang];

    if (!hasOwnProperty<typeof words>(words, word)) {
      throw new Error(`Word ${word} is not defined`);
    }

    return Promise.resolve(words[word]);
  },
};
