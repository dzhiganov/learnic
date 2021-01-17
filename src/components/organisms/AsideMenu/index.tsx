import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import { HOME_WORDS, HOME_WORDS_FOR_TODAY } from '../../../core/router/paths';

const items = [
  {
    key: 'all-words',
    title: '📚 My words',
    to: HOME_WORDS,
  },
  {
    key: 'words-for-today',
    title: '📖  Words for Today',
    to: HOME_WORDS_FOR_TODAY,
  },
];

const AsideMenu: React.FunctionComponent = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {items.map(({ key, title, to }) => (
          <Link key={key} className={styles.link} to={to}>
            <li
              className={`${styles.item} ${
                pathname === to ? styles.itemActive : ''
              }`}
            >
              <span>{title}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default AsideMenu;
