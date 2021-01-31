import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Form from '~c/organisms/Form';
import database from '../../../database';
import styles from './styles.module.css';
import { HOME } from '~router/paths';

type Credentials = {
  login: string;
  password: string;
};

const SignUp: React.FunctionComponent = () => {
  const history = useHistory();
  const handleSignUp = useCallback(
    ({ login, password }: Credentials): void => {
      database
        .auth()
        .createUserWithEmailAndPassword(login, password)
        .then(() => history.push(HOME));
    },
    [history]
  );

  return (
    <div className={styles.container}>
      <Form
        onSubmit={handleSignUp}
        title={
          <span>
            Sign up <span className={styles.learnic}>Learnic</span>
          </span>
        }
      />
    </div>
  );
};

export default SignUp;
