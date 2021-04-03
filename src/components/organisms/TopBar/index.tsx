import React, { memo, useState, useMemo, useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import { useTranslation } from 'react-i18next';
import Switch from '@material-ui/core/Switch';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import User from '~c/molecules/User';
import styles from './styles.module.css';
import { logout } from '~actions/user';
import LangPicker from '~c/molecules/LangPicker';
import AsideMenu from '~c/organisms/AsideMenu';
import Logo from '~c/atoms/Logo';
import { useColorScheme, ColorSchemes } from '~hooks/../colorSchemeContext';

const CustomSwitch = withStyles(() =>
  createStyles({
    root: {
      width: 80,
      height: 48,
      padding: 8,
    },
    switchBase: {
      padding: 11,
      color: '#ff6a00',
    },
    thumb: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
    },
    track: {
      background: 'linear-gradient(to left, #434343, black)',
      opacity: '1 !important',
      borderRadius: 20,
      position: 'relative',
      '&:before, &:after': {
        display: 'inline-block',
        position: 'absolute',
        top: '50%',
        width: '50%',
        transform: 'translateY(-50%)',
        color: '#fff',
        textAlign: 'center',
      },
      '&:before': {
        content: '"☀️"',
        left: 4,
        opacity: 0,
      },
      '&:after': {
        content: '"🌙"',
        right: 4,
      },
    },
    checked: {
      '&$switchBase': {
        color: '#185a9d',
        transform: 'translateX(32px)',
        '&:hover': {
          backgroundColor: 'linear-gradient(to right, #434343, black)',
        },
      },
      '& $thumb': {
        backgroundColor: '#fff',
      },
      '& + $track': {
        background:
          'linear-gradient(to right, hsl(210, 100%, 30%), hsl(210, 100%, 41%));',
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
    },
  })
)(Switch);

const TopBar: React.FC = () => {
  const {
    dispatch: dispatchTheme,
    state: { scheme },
  } = useColorScheme();
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
        <div className={styles.leftContainer}>
          <CustomSwitch
            checked={scheme === ColorSchemes.DARK}
            onChange={(e) => {
              dispatchTheme({
                type: e.target.checked ? ColorSchemes.DARK : ColorSchemes.LIGHT,
              });
            }}
          />
          <Logo />
          <AsideMenu />
        </div>
        <div className={styles.controls}>
          <LangPicker />
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
