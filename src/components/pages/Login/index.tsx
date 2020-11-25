import React, { useEffect, useState, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Base from '../../templates/Base';
import Form from '../../organisms/Form';
import database from '../../../database';
import styles from './styles.module.css';

type Credentials = {
  login: string;
  password: string;
};

const Login: React.FunctionComponent = () => {
  const user = useSelector((state: { user: any }) => state.user);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = useCallback(({ login, password }: Credentials): void => {
    database
      .auth()
      .signInWithEmailAndPassword(login, password)
      .catch((error: any) => {});
  }, []);

  useEffect(() => {
    database.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

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
