import React, { memo, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Form from '~c/organisms/Form';
import database from '../../../database';
import styles from './styles.module.css';
import { HOME } from '~router/paths';
import { fetchFirebaseUser } from '~actions/user';

type Credentials = {
  login: string;
  password: string;
};

const Login = (): React.ReactElement => {
  const history = useHistory();

  const handleLogin = useCallback(
    ({ login, password }: Credentials): void => {
      database
        .auth()
        .signInWithEmailAndPassword(login, password)
        .then(fetchFirebaseUser)
        .then(() => history.push(HOME));
    },
    [history]
  );

  return (
    <div className={styles.container}>
      <Form
        onSubmit={handleLogin}
        title={
          <span>
            Sign in <span className={styles.learnic}>Learnic</span>
          </span>
        }
      />
      <div className={styles.linkToSignUpBlock}>
        <Link to="/signup" className={styles.link}>
          if you don&apos;t have an account, you can create it
        </Link>
      </div>
    </div>
  );
};

export default memo(Login);
