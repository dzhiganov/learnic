/* eslint-disable css-modules/no-unused-class */
import React, { memo, useState, useMemo, useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import User from '~c/molecules/User';
import styles from './styles.module.css';
import { logout } from '~actions/user';
import AsideMenu from '~c/organisms/AsideMenu';
import Logo, { Logos } from '~c/atoms/Logo';
import { HOME_PROFILE } from '~router/paths';

const TopBar: React.FC = () => {
  const history = useHistory();
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
        id: 'profile',
        title: t('TOP_BAR.PROFILE'),
        onClick: () => {
          history.push(HOME_PROFILE);
          handleClose();
        },
      },
      {
        id: 'logout',
        title: t('TOP_BAR.LOGOUT'),
        onClick: handleLogout,
      },
    ],
    [handleLogout, t, history]
  );

  if (!isWide) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.leftContainer}>
          <Logo name={Logos.TextColorLogo} />
          <AsideMenu />
        </div>
        <div className={styles.controls}>
          <User onClick={handleClick} />
        </div>
        <Popover
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div>
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
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default memo(TopBar);
