import React, { useCallback } from 'react';
import Modal from '@material-ui/core/Modal';
import { useTranslation } from 'react-i18next';
import Logo from '~c/atoms/Logo';
import Button from '~c/atoms/Button';
import styles from './styles.module.css';
import Login from '~c/pages/Login';

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <main>
      <header className={styles.header}>
        <div className={styles.top}>
          <Button title={t('LANDING.LOGIN')} onClick={handleClick} />
        </div>
        <Logo size="large" />
      </header>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Login />
      </Modal>
    </main>
  );
};

export default Landing;
