import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useSelector from '~hooks/useSelector';
import styles from './styles.module.css';
import { keys } from './consts';

type Props = {
  id: string;
  title: string;
  to: string;
};

const MenuItem: React.FunctionComponent<Props> = ({ id, title, to }: Props) => {
  const { pathname } = useLocation();
  const { length: trainingLength } = useSelector('words.training') || [];
  const isActive = pathname === to;
  const showTrainingCount =
    id === keys.WORDS_FOR_TODAY && trainingLength > 0 && !isActive;

  return (
    <Link className={styles.link} to={to} data-testid="page-link">
      <li className={`${styles.item} ${isActive ? styles.itemActive : ''}`}>
        <div>
          <span>{title}</span>
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
