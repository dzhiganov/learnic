import mockAxios from 'axios';
import { getDefinition, baseURL } from '../dictionary';

const proxy = process.env.REACT_APP_PROXY;

it('fetches data from dictionary with default language', async () => {
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: [{ word: 'test' }],
    })
  );

  const response = await getDefinition('test');

  expect(response).toEqual([{ word: 'test' }]);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(`${proxy}/${baseURL}/en/test`);
});

it('fetches data from dictionary with russian language', async () => {
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: [{ word: 'тест' }],
    })
  );

  const response = await getDefinition('тест', 'ru');

  expect(response).toEqual([{ word: 'тест' }]);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(`${proxy}/${baseURL}/ru/тест`);
});
