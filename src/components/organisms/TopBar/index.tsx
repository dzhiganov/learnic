import React, { memo, useState, useMemo, useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import { useTranslation } from 'react-i18next';
import User from '~c/molecules/User';
import styles from './styles.module.css';
import { logout } from '~actions/user';
import LangPicker from '~c/molecules/LangPicker';
import AsideMenu from '~c/organisms/AsideMenu';

const TopBar: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const isWide = useMedia('(min-width: 576px)');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleKeyDownLogout = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleLogout();
      }
    },
    [handleLogout]
  );

  const menuItems = useMemo(
    () => [
      {
        id: 'logout',
        title: t('TOP_BAR.LOGOUT'),
        onClick: handleLogout,
      },
    ],
    [handleLogout, t]
  );

  if (!isWide) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>Learnic</div>
        <AsideMenu />
        <div className={styles.controls}>
          <LangPicker />
          <User onClick={handleClick} />
        </div>
        <Popover
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <ul className={styles.userMenu}>
            {menuItems.map(({ id, title, onClick }) => (
              <li className={styles.userMenuItem} key={id}>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleKeyDownLogout}
                  onClick={onClick}
                >
                  {title}
                </div>
              </li>
            ))}
          </ul>
        </Popover>
      </div>
    </div>
  );
};

export default memo(TopBar);
