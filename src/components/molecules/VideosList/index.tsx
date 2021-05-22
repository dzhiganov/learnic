import React, { memo, useEffect, useState } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import styles from './styles.module.css';
import { getList } from '~store/api/videos';
import Skeleton from '~c/atoms/Skeleton';
import VideoItem from './VideoItem';

type Props = {
  keyword: string;
};

const VideosList: React.FC<Props> = ({ keyword }: Props) => {
  const [list, setList] = useState<{ id: string; description: string }[]>([]);
  const [{ loading }, fetch] = useAsyncFn(
    async (word) => {
      const { items } = await getList(word);
      const result = items.map(
        ({ id: { videoId }, snippet: { description } }) => ({
          id: videoId,
          description,
        })
      );
      setList(result);
    },
    [],
    { loading: true }
  );

  useEffect(() => {
    if (keyword) {
      fetch(keyword);
    }
  }, [fetch, keyword]);

  if (loading) {
    return (
      <ul className={styles.list}>
        <Skeleton variant="rect" width={512} height={288} repeat={3} />
      </ul>
    );
  }

  return (
    <ul className={styles.list}>
      {list.map(({ id, description }) => (
        <li key={id} className={styles.listItem}>
          <p className={styles.description}>{description}</p>
          <VideoItem id={id} />
        </li>
      ))}
    </ul>
  );
};

export default memo(VideosList);
