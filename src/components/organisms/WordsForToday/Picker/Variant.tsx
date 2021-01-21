import React, { useCallback } from 'react';
import styles from './styles.module.css';

type Props = {
  variant: string;
  pick: (variant: string) => void;
};

const Variant: React.FunctionComponent<Props> = ({ variant, pick }: Props) => {
  console.log(variant);
  const onClick = useCallback(() => pick(variant), [variant, pick]);
  const onKeyDown = useCallback(
    ({ key = '' } = {}) => (key === 'Enter' ? pick(variant) : null),
    [variant, pick]
  );

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        className={styles.item}
        data-translate={variant}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <span>{variant}</span>
      </div>
    </li>
  );
};

export default Variant;
