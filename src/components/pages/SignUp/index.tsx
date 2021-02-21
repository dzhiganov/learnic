import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Form from '~c/organisms/Form';
import database from '../../../database';
import styles from './styles.module.css';
import { fetchFirebaseUser } from '~actions/user';

type Credentials = {
  login: string;
  password: string;
};

const SignUp: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleSignUp = useCallback(
    ({ login, password }: Credentials): void => {
      database
        .auth()
        .createUserWithEmailAndPassword(login, password)
        .then(() => {
          dispatch(fetchFirebaseUser());
        });
    },
    [dispatch]
  );

  return (
    <div className={styles.container}>
      <Form
        onSubmit={handleSignUp}
        title={<span className={styles.title}>{t('SIGN_UP_PAGE.TITLE')}</span>}
      />
      <div className={styles.linkBlock}>
        <Link to="/signin" className={styles.link}>
          {t('SIGN_UP_PAGE.ALREADY_HAVE_ACCOUNT')}
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
