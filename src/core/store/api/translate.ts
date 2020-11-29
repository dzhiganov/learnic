const baseURL = 'https://developers.lingvolive.com/api';
const AUTHORIZATION = 'Authorization';

const auth = async (apiKey: string): Promise<any> => {
  const url = `${baseURL}/v1.1/authenticate`;
  //   const { data } = await axios.post(url, null, {
  //     withCredentials: true,
  //     headers: {
  //       [AUTHORIZATION]: `Basic ${apiKey}`,
  //       'Access-Control-Allow-Origin': '*',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  const data = fetch(url, {
    headers: {
      [AUTHORIZATION]: `Basic ${apiKey}`,
    },
    method: 'POST',
  });

  return data;
};

export default {
  auth,
};
