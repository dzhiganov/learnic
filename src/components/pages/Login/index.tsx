import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import { authWithGoogle } from '~actions/user';
import GoogleIcon from './Icons/Google';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleAuthWithGoogle = useCallback(() => dispatch(authWithGoogle()), [
    dispatch,
  ]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('LOGIN_PAGE.TITLE')}</h2>
      <div className={styles.providers}>
        <button
          type="button"
          className={styles.providerButton}
          onClick={handleAuthWithGoogle}
        >
          <GoogleIcon />
          {t('LOGIN_PAGE.WITH_GOOGLE')}
        </button>
      </div>
    </div>
  );
};

export default Login;
