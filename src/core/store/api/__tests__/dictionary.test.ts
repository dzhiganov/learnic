import mockAxios from 'axios';
import { getDefinition, baseURL, proxy } from '../dictionary';

it('fetches data from dictionary with default language', async () => {
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: [{ word: 'test' }],
    })
  );

  const images = await getDefinition('test');

  expect(images).toEqual([{ word: 'test' }]);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(`${proxy}/${baseURL}/en/test`);
});

it('fetches data from dictionary with russian language', async () => {
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: [{ word: 'тест' }],
    })
  );

  const images = await getDefinition('тест', 'ru');

  expect(images).toEqual([{ word: 'тест' }]);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(`${proxy}/${baseURL}/ru/тест`);
});
