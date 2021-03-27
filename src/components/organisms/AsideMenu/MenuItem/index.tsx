import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      className={styles.link}
      to={to}
      data-testid="page-link"
      onClick={onClick}
    >
      <li className={`${styles.item} ${isActive && styles.itemActive}`}>
        <div className={styles.itemWrapper}>
          <span className={styles.title}>{t(title)}</span>
        </div>
      </li>
    </Link>
  );
};

export default memo(MenuItem);
