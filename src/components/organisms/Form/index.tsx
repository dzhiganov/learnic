import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';

type Props = {
  onSubmit: (credentials: { login: string; password: string }) => void;
  title: JSX.Element;
};

const Form: React.FunctionComponent<Props> = ({ onSubmit, title }: Props) => {
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
      <h2 className={styles.formTitle}>{title}</h2>
      <div>
        <div>
          <label htmlFor="login">
            <span className={styles.inputTitle}>Email</span>
            <input
              id="login"
              type="text"
              className={styles.input}
              value={login}
              onChange={handleChangeLogin}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            <span className={styles.inputTitle}>Password</span>
            <input
              id="pass"
              type="password"
              className={styles.input}
              value={password}
              onChange={handleChangePassword}
            />
          </label>
        </div>
        <div className={styles.buttonContainer}>
          <button
            data-testId="submit-button"
            type="submit"
            className={styles.submitButton}
            onClick={wrappedOnSubmit}
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
