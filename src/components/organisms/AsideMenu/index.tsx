import React, { useMemo } from 'react';
import useMedia from 'react-use/lib/useMedia';
import styles from './styles.module.css';
import MenuItem from './MenuItem';
import { desktopItems, mobileItems } from './consts';
import Wrapper from '~c/atoms/Wrapper';

const AsideMenu: React.FunctionComponent = () => {
  const isWide = useMedia('(min-width: 720px)');

  const list = useMemo(
    () => (
      <ul className={styles.list}>
        {(isWide ? desktopItems : mobileItems).map(({ key, title, to }) => (
          <MenuItem key={key} id={key} title={title} to={to} isWide={isWide} />
        ))}
      </ul>
    ),
    [isWide]
  );

  return (
    <Wrapper>
      <div className={styles.container}>{list}</div>
    </Wrapper>
  );
};

export default AsideMenu;
