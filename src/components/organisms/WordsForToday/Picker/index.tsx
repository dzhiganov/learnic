import React, { memo } from 'react';
import styles from './styles.module.css';
import Variant from './Variant';
import type { Variants } from '..';

type Props = {
  currentWord: string;
  variants: Variants;
  pick: (translate: string) => void;
  wordsCount: [number, number];
};

const Picker: React.FunctionComponent<Props> = ({
  currentWord,
  variants,
  pick,
  wordsCount,
}: Props) => {
  const [completed, all] = wordsCount;
  const left = all - completed;

  return (
    <div className={styles.container}>
      <div className={styles.left}>{`${left}/${all}`}</div>
      <div className={styles.word}>{currentWord}</div>
      <ul className={styles.list}>
        {variants.map((variant) => (
          <Variant variant={variant} pick={pick} />
        ))}
      </ul>
    </div>
  );
};

export default memo(Picker);
