import axios from 'axios';

export const baseURL = 'https://api.dictionaryapi.dev/api/v2/entries';
const proxy = process.env.REACT_APP_PROXY;

export const getDefinition = async (
  word: string,
  lang = 'en'
): Promise<Record<string, unknown>> => {
  const url = `${proxy}/${baseURL}/${lang}/${word}`;
  const { data } = await axios.get(url);

  return data;
};
