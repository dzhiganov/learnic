import axios from 'axios';

export const baseURL = 'https://developers.lingvolive.com/api';
export const AUTHORIZATION = 'Authorization';

const proxy = process.env.REACT_APP_PROXY;

const langCodes = {
  ru: '1033',
  en: '1049',
};

export const auth = async (apiKey: string): Promise<string> => {
  const url = `${proxy}/${baseURL}/v1.1/authenticate`;
  const { data } = await axios.post(url, null, {
    headers: {
      [AUTHORIZATION]: `Basic ${apiKey}`,
    },
  });

  return data;
};

export const getTranslate = async (
  apiKey: string,
  word: string,
  sourceLang: keyof typeof langCodes,
  destinationLang: keyof typeof langCodes
): Promise<Record<string, unknown>> => {
  const url = `${proxy}/${baseURL}/v1/Minicard/?text=${word}&srcLang=${langCodes[sourceLang]}&dstLang=${langCodes[destinationLang]}`;
  const { data } = await axios.get(url, {
    headers: {
      [AUTHORIZATION]: `Bearer ${apiKey}`,
    },
  });

  return data;
};
