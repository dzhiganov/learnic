import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { HOME_WORDS } from '../../../core/router/paths';

const items = [
  {
    key: 'my-words',
    title: 'My words',
    to: HOME_WORDS,
  },
];

const AsideMenu: React.FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {items.map(({ key, title, to }) => (
          <li key={key} className={styles.item}>
            <Link className={styles.link} to={to}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AsideMenu;
