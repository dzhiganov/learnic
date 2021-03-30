import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

const InfoBlock: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <p>{t('CARDS.ALL_WORDS_REPEATED')}</p>
      <p>
        <span>{t('CARDS.GO_TO')}</span>
        <a href="/home/words">{t('CARDS.DICTIONARY')}</a>
      </p>
    </div>
  );
};

export default InfoBlock;
