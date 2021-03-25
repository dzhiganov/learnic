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
    <div>
      <header className={styles.header}>
        <div className={styles.top}>
          <Logo size="large" />
          <Button title={t('LANDING.LOGIN')} onClick={handleClick} />
        </div>
      </header>
      <main className={styles.main}>
        <div className={`${styles.block} ${styles.mainBlock}`}>
          <h3 className={styles.blockTitle}>{t('LANDING.MAIN.TITLE')}</h3>
          <p>
            <ul className={styles.list}>
              <li>{t('LANDING.MAIN.LIST.0')}</li>
              <li>{t('LANDING.MAIN.LIST.1')}</li>
              <li>{t('LANDING.MAIN.LIST.2')}</li>
              <li>{t('LANDING.MAIN.LIST.3')}</li>
            </ul>
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            {t('LANDING.WHY_IT_WORKS.TITLE')}
          </h3>
          <p>
            <ul className={styles.list}>
              <li>{t('LANDING.WHY_IT_WORKS.LIST.0')}</li>
              <li>{t('LANDING.WHY_IT_WORKS.LIST.1')}</li>
            </ul>
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{t('LANDING.HOW_TO_USE.TITLE')}</h3>
          <p>{t('LANDING.HOW_TO_USE.TEXT')}</p>
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
