import React from 'react';
import styles from './styles.module.css';
import MenuItem from './MenuItem';
import { items } from './consts';

const AsideMenu: React.FunctionComponent = () => (
  <div className={styles.container}>
    <ul className={styles.list}>
      {items.map(({ key, title, to }) => (
        <MenuItem key={key} id={key} title={title} to={to} />
      ))}
    </ul>
  </div>
);

export default AsideMenu;
