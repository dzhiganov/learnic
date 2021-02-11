import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Form from '~c/organisms/Form';
import database from '../../../database';
import styles from './styles.module.css';
import { fetchFirebaseUser } from '~actions/user';

type Credentials = {
  login: string;
  password: string;
};

const SignUp: React.FunctionComponent = () => {
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
        title={
          <span className={styles.title}>
            Sign up <span className={styles.logo}>Learnic</span>
          </span>
        }
      />
    </div>
  );
};

export default SignUp;
