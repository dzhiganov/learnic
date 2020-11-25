import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Base from '../../templates/Base';
import Form from '../../organisms/Form';
import database from '../../../database';
import styles from './styles.module.css';
import { HOME } from '../../../core/router/paths';

type Credentials = {
  login: string;
  password: string;
};

const Login = (): React.ReactElement => {
  const history = useHistory();
  const user = useSelector(
    (state: {
      user: {
        user: Record<string, string>;
      };
    }) => state.user
  );

  const handleLogin = useCallback(
    ({ login, password }: Credentials): void => {
      database
        .auth()
        .signInWithEmailAndPassword(login, password)
        .then(() => history.push(HOME));
    },
    [history]
  );

  if (user.user.uid) {
    history.push(HOME);
  }

  return (
    <Base>
      <div className={styles.container}>
        <Form onSubmit={handleLogin} title="Sign in." submitText="Sign In" />
        <div className={styles.linkToSignUpBlock}>
          <Link to="/signup" className={styles.link}>
            if you don&apos;t have an account, you can create it
          </Link>
        </div>
      </div>
    </Base>
  );
};

export default memo(Login);
