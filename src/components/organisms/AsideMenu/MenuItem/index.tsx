import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type Props = {
  title: string;
  to: string;
  onClick: () => void;
};

const MenuItem: React.FunctionComponent<Props> = ({
  title,
  to,
  onClick,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Link
      className={styles.link}
      to={to}
      data-testid="page-link"
      onClick={onClick}
    >
      <li className={`${styles.item}`}>
        <div className={styles.itemWrapper}>
          <span className={styles.title}>{t(title)}</span>
        </div>
      </li>
    </Link>
  );
};

export default memo(MenuItem);
