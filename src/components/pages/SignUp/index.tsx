import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Base from '../../templates/Base';
import Form from '../../organisms/Form';
import database from '../../../database';
import styles from './styles.module.css';
import { HOME } from '../../../core/router/paths';

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
        .then(() => history.push(HOME))
        .catch((error: any) => console.error(error));
    },
    [history]
  );

  return (
    <Base>
      <div className={styles.container}>
        <Form onSubmit={handleSignUp} title="Sign up." submitText="Sign Up" />
      </div>
    </Base>
  );
};

export default SignUp;
