import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSelector from '~hooks/useSelector';
import styles from './styles.module.css';
import { keys } from '../consts';

type Props = {
  id: string;
  title: string;
  to: string;
  prefix: string;
  onClick: () => void;
};

const MenuItem: React.FunctionComponent<Props> = ({
  id,
  title,
  to,
  prefix,
  onClick,
}: Props) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { length: trainingLength } = useSelector('words.training') || [];
  const isActive = pathname === to;
  const showTrainingCount = id === keys.TRAININGS && trainingLength > 0;

  return (
    <Link
      className={styles.link}
      to={to}
      data-testid="page-link"
      onClick={onClick}
    >
      <li className={`${styles.item} ${isActive ? styles.itemActive : ''}`}>
        <div className={styles.itemWrapper}>
          <span>{`${prefix} ${t(title)}`}</span>
          {showTrainingCount ? (
            <span className={styles.note} data-testid="training-count">
              {trainingLength}
            </span>
          ) : null}
        </div>
      </li>
    </Link>
  );
};

export default memo(MenuItem);
