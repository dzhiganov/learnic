import React, { useState, useMemo } from 'react';
import useMedia from 'react-use/lib/useMedia';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import styles from './styles.module.css';
import MenuItem from './MenuItem';
import { items } from './consts';
import Wrapper from '~c/atoms/Wrapper';

const AsideMenu: React.FunctionComponent = () => {
  const isWide = useMedia('(min-width: 576px)');
  const [showMenu, setShowMenu] = useState(false);

  const list = useMemo(() => {
    return (
      <ul className={styles.list}>
        {items.map(({ key, title, to }) => (
          <MenuItem
            key={key}
            title={title}
            to={to}
            onClick={() => setShowMenu(false)}
          />
        ))}
      </ul>
    );
  }, []);

  if (!isWide) {
    return (
      <div className={styles.topBar}>
        <Button onClick={() => setShowMenu(true)}>
          <MenuIcon className={styles.menuIcon} />
        </Button>
        <Drawer
          open={showMenu}
          anchor="right"
          onClose={() => setShowMenu(false)}
        >
          {list}
        </Drawer>
      </div>
    );
  }

  return (
    <Wrapper>
      <div className={styles.container}>{list}</div>
    </Wrapper>
  );
};

export default AsideMenu;
