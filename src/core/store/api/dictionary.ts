import axios from 'axios';

const baseURL = 'https://api.dictionaryapi.dev/api/v2/entries';
const proxy = 'https://cors-anywhere.herokuapp.com';

const getDefinition = async (
  word: string,
  lang = 'en'
): Promise<Record<string, unknown>> => {
  const url = `${proxy}/${baseURL}/${lang}/${word}`;
  const { data } = await axios.get(url);

  return data;
};

export default {
  getDefinition,
};
