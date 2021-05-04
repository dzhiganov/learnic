import fetch from 'node-fetch';

const baseURL = 'https://api.dictionaryapi.dev/api/v2/entries';

class Dictionary {
  static async getDefinition(
    word: string,
    lang = 'en'
  ): Promise<Record<string, unknown>> {
    const url = `${baseURL}/${lang}/${word}`;
    const data = await fetch(url).then((res) => res.json());

    return data;
  }
}

export default Dictionary;
