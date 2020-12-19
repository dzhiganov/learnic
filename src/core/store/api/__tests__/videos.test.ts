import mockAxios from 'axios';
import { getList, baseURL } from '../videos';

const proxy = process.env.REACT_APP_PROXY;

const mockData = [
  {
    id: 1,
    name: 'video1',
  },
  {
    id: 2,
    name: 'video2',
  },
  {
    id: 3,
    name: 'video3',
  },
];

it('fetches video list from youtube', async () => {
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      data: mockData,
    })
  );

  const response = await getList('javascript');

  expect(response).toEqual(mockData);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(`${proxy}/${baseURL}`, {
    params: {
      key: process.env.REACT_APP_GOOGLE_API_KEY,
      part: 'snippet',
      q: 'javascript+english',
      type: 'video',
    },
  });
});
