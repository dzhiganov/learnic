import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';

type Props = {
  onSubmit: (credentials: { login: string; password: string }) => void;
  title: string;
  submitText: string;
};

const Form: React.FunctionComponent<Props> = ({
  onSubmit,
  title,
  submitText,
}: Props) => {
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');

  const wrappedOnSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit({
        login,
        password,
      });
    },
    [login, password, onSubmit]
  );

  const handleChangeLogin = useCallback(
    ({ target: { value = '' } = {} }) => setLogin(value),
    []
  );

  const handleChangePassword = useCallback(
    ({ target: { value = '' } = {} }) => setPassword(value),
    []
  );

  return (
    <form className={styles.form}>
      <h2>{title}</h2>
      <div>
        <div>
          <input
            id="login"
            type="text"
            className={styles.input}
            value={login}
            onChange={handleChangeLogin}
          />
        </div>
        <div>
          <input
            id="pass"
            type="password"
            className={styles.input}
            value={password}
            onChange={handleChangePassword}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            onClick={wrappedOnSubmit}
          >
            {submitText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
