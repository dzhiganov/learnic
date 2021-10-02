import React, { useCallback } from 'react';
import Modal from '@material-ui/core/Modal';
import Logo from '~c/atoms/Logo';
import Button from '~c/atoms/Button';
import styles from './styles.module.css';
import Login from '~c/molecules/Login';

const Landing: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <Logo />
            <h2 className={styles.subtitle}>
              Simple app to remember new words
            </h2>
          </div>
          <div className={`${styles.block}`}>
            <Button
              title="Get Started"
              onClick={handleClick}
              className={styles.startButton}
            />
          </div>
        </header>
        <img src="promo.png" alt="" className={styles.promoImageDictionary} />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Login />
      </Modal>
      <footer className={styles.footer}>
        <div>
          <a className={styles.link} href="https://github.com/delawere/learnic">
            GitHub
          </a>
          <span
            className={styles.copyright}
          >{`© Learnic ${new Date().getFullYear()} `}</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
