/* eslint-disable css-modules/no-unused-class */
import React, { memo, useState, useMemo, useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import User from '~c/molecules/User';
import styles from './styles.module.css';
import { logout } from '~actions/user';
import LangPicker from '~c/molecules/LangPicker';
import AsideMenu from '~c/organisms/AsideMenu';
import Logo from '~c/atoms/Logo';
import { useColorScheme, ColorSchemes } from '~hooks/../colorSchemeContext';
import useSelector from '~hooks/useSelector';
import CustomSwitch from './CustomSwitch';
import updateUserOptionsMutation from '~graphql/mutations/updateUserOptions';

const TopBar: React.FC = () => {
  const {
    state: { scheme },
  } = useColorScheme();
  const { t } = useTranslation();
  const isWide = useMedia('(min-width: 576px)');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const uid = useSelector<string>('user.uid');
  const [updateUserOptions] = useMutation(updateUserOptionsMutation);

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

  const handleSwitchTheme = useCallback(
    ({ target: { checked } }) => {
      const newSchemeValue = checked ? ColorSchemes.DARK : ColorSchemes.LIGHT;

      const optimisticResponse = {
        updateUserOptions: {
          uid,
          userOptions: {
            colorScheme: newSchemeValue,
            __typename: 'UserOptions',
          },
          __typename: 'User',
        },
      };

      updateUserOptions({
        variables: {
          uid,
          userOptions: { colorScheme: newSchemeValue },
        },
        optimisticResponse,
      });
    },
    [uid, updateUserOptions]
  );

  if (!isWide) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.leftContainer}>
          <Logo />
          <AsideMenu />
        </div>
        <div className={styles.controls}>
          {/* <CustomSwitch
            checked={scheme === ColorSchemes.DARK}
            onChange={handleSwitchTheme}
          />
          <LangPicker /> */}
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
