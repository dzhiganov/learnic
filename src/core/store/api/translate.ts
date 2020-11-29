import axios from 'axios';

type UserState = {
  token: string;
  error: string;
};

const baseURL = 'https://developers.lingvolive.com/api';
const AUTHORIZATION = 'Authorization';

const auth = async (apiKey: string): Promise<UserState> => {
  const url = `${baseURL}/v1.1/authenticate`;
  const { data } = await axios.post(url, null, {
    headers: {
      [AUTHORIZATION]: `Basic ${apiKey}`,
    },
  });

  return data;
};

export default {
  auth,
};
