import mockAxios from 'axios';
import { baseURL, auth, getTranslate } from '../translate';

const apiKey = 'secret';
const proxy = process.env.REACT_APP_PROXY;

it('get token', async () => {
  (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: 'token',
    })
  );

  const response = await auth(apiKey);

  expect(response).toEqual('token');
  expect(mockAxios.post).toHaveBeenCalledTimes(1);
  expect(mockAxios.post).toHaveBeenCalledWith(
    `${proxy}/${baseURL}/v1.1/authenticate`,
    null,
    {
      headers: { Authorization: 'Basic secret' },
    }
  );
});

it('get translate', async () => {
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: 'тест',
    })
  );

  const response = await getTranslate('token', 'test', 'ru', 'en');

  expect(response).toEqual('тест');
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(
    `${proxy}/${baseURL}/v1/Minicard/?text=test&srcLang=ru&dstLang=en`,
    {
      headers: { Authorization: 'Bearer token' },
    }
  );
});
