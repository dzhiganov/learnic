import React, { memo, useState, useCallback } from 'react';
import styles from './styles.module.css';

type Props = {
  id: string;
};

const VideoItem: React.FC<Props> = ({ id }: Props) => {
  const [enabled, setEnabled] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    if (!enabled) {
      setEnabled(true);
    }
  }, [enabled]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && !enabled) {
        setEnabled(true);
      }
    },
    [enabled]
  );

  if (enabled) {
    return (
      <div
        role="button"
        className={styles.video}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <iframe
          title={id}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${id}?rel=0&showinfo=0&autoplay=1`}
          allow="autoplay"
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      className={styles.video}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <a href={`https://youtu.be/${id}`}>
        <picture>
          <source
            type="image/webp"
            srcSet={`https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`}
          />
          <img
            className={styles.videoMedia}
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt="Video preview"
          />
        </picture>
      </a>
      <button
        type="button"
        className={`${styles.videoButton} ${styles.videoButtonEnabled}`}
        aria-label="Play video"
      >
        <svg
          x="0px"
          y="0px"
          viewBox="0 0 71.412065 50"
          width="71.412064"
          height="50"
        >
          <defs id="defs31" />
          <g transform="scale(0.58823529,0.58823529)">
            <path
              d="M 118.9,13.3 C 117.5,8.1 113.4,4 108.2,2.6 98.7,0 60.7,0 60.7,0 60.7,0 22.7,0 13.2,2.5 8.1,3.9 3.9,8.1 2.5,13.3 0,22.8 0,42.5 0,42.5 0,42.5 0,62.3 2.5,71.7 3.9,76.9 8,81 13.2,82.4 22.8,85 60.7,85 60.7,85 c 0,0 38,0 47.5,-2.5 5.2,-1.4 9.3,-5.5 10.7,-10.7 2.5,-9.5 2.5,-29.2 2.5,-29.2 0,0 0.1,-19.8 -2.5,-29.3 z"
              id="path7"
              className={styles.videoButtonShape}
            />
            <polygon
              className={styles.videoButtonIcon}
              points="80.2,42.5 48.6,24.3 48.6,60.7 "
              id="polygon9"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default memo(VideoItem);
