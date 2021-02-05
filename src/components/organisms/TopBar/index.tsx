import React, { memo, useState, useMemo, useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import { useDispatch } from 'react-redux';
import User from '~c/molecules/User';
import styles from './styles.module.css';
import { logout } from '~actions/user';

const TopBar: React.FunctionComponent = () => {
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
        title: 'Log out',
        onClick: handleLogout,
      },
    ],
    [handleLogout]
  );

  return (
    <div className={styles.container}>
      <User onClick={handleClick} />
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
  );
};

export default memo(TopBar);
