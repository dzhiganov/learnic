import React, { useCallback } from 'react';
import Modal from '@material-ui/core/Modal';
import Logo, { Logos } from '~c/atoms/Logo';
import Button from '~c/atoms/Button';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './styles.module.css';
import Login from '~c/molecules/Login';

const Landing: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo name={Logos.FullLogo} size="large" />
        <h2 className={styles.subtitle}>One place - all dictionaries</h2>
        <div className={styles.images}>
          <img src="promo.png" alt="" className={styles.promoImageDictionary} />
        </div>
      </header>
      <main className={styles.main}>
        <div className={`${styles.block}`}>
          <Button
            title="✌️ Sign in"
            onClick={handleClick}
            className={styles.startButton}
          />
        </div>
      </main>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Login />
      </Modal>
    </div>
  );
};

export default Landing;
