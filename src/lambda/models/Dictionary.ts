import fetch from 'node-fetch';

const baseURL = 'https://api.dictionaryapi.dev/api/v2/entries';

type Response = {
  word: string;
  phonetics: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example: string; synonyms: string[] }[];
  }[];
}[];

class Dictionary {
  static async getDefinition(word: string, lang = 'en'): Promise<Response> {
    const url = `${baseURL}/${lang}/${word}`;
    const data = await fetch(url).then((res) => res.json());

    return data;
  }
}

export type { Response };
export default Dictionary;
