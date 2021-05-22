import axios from 'axios';

export const baseURL = 'https://www.googleapis.com/youtube/v3/search';
const proxy = process.env.REACT_APP_PROXY;

export const getList = async (
  keyword: string
): Promise<
  Record<string, unknown> & {
    items: Array<{
      id: { videoId: string };
      snippet: { channelTitle: string; description: string };
    }>;
  }
> => {
  const url = `${proxy}/${baseURL}`;
  const { data } = await axios.get(url, {
    params: {
      part: 'snippet',
      key: process.env.REACT_APP_GOOGLE_API_KEY,
      type: 'video',
      q: `${keyword}+english`,
    },
  });

  return data;
};
