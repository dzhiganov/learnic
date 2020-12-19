import axios from 'axios';

export const baseURL = 'https://developers.lingvolive.com/api';
const proxy = process.env.REACT_APP_PROXY;
export const AUTHORIZATION = 'Authorization';

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
  sourceLang: string,
  destinationLang: string
): Promise<Record<string, unknown>> => {
  const url = `${proxy}/${baseURL}/v1/Minicard/?text=${word}&srcLang=${sourceLang}&dstLang=${destinationLang}`;
  const { data } = await axios.get(url, {
    headers: {
      [AUTHORIZATION]: `Bearer ${apiKey}`,
    },
  });

  return data;
};
