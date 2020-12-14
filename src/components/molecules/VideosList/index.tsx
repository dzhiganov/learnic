/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { memo, useEffect, useState, useCallback } from 'react';
import styles from './styles.module.css';
import { getList } from '../../../core/store/api/videos';
import VideoItem from './VideoItem';

type Props = {
  keyword: string;
};

const VideosList: React.FunctionComponent<Props> = ({ keyword }: Props) => {
  const [list, setList] = useState<string[]>([]);

  const handleSetList = useCallback(async (word) => {
    const { items } = await getList(word);
    const result = items.map(({ id: { videoId } }) => videoId);
    setList(result);
  }, []);

  useEffect(() => {
    if (keyword) {
      handleSetList(keyword);
    }
  }, [handleSetList, keyword]);

  return (
    <ul className={styles.list}>
      {list.map((id) => (
        <li key={id} className={styles.listItem}>
          <VideoItem id={id} />
        </li>
      ))}
    </ul>
  );
};

export default memo(VideosList);
