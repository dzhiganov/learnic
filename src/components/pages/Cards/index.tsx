/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import useSelector from '~hooks/useSelector';
import styles from './styles.module.css';
import Card from './Card/Card';
import { fetchUpdate } from '~actions/words';
import getNewRepeatTimeByStep from './utils/getNewRepeatTimeByStep';

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 8,
      borderRadius: 4,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 4,
      backgroundColor: '#00af91',
    },
  })
)(LinearProgress);

const Cards: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const uid = useSelector('user.uid');
  const words = useSelector('words.training') as any[];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [successful, setSuccesseful] = useState<any[]>([]);
  const [failed, setFailed] = useState<any[]>([]);

  const back = useCallback(() => {
    const newIndex = currentIndex - 1;
    if (!words[newIndex]) return;
    setCurrentIndex(newIndex);
  }, [currentIndex, words]);

  const next = useCallback(() => {
    const newIndex = currentIndex + 1;
    if (!words[newIndex]) return;
    setCurrentIndex(newIndex);
  }, [currentIndex, words]);

  const handleDone = useCallback(() => {
    setSuccesseful([...successful, currentIndex]);
    const newIndex = currentIndex + 1;
    if (!words[newIndex]) return;
    setCurrentIndex(newIndex);

    window.requestAnimationFrame(() => {
      const { id, step: currentStep } = words[currentIndex];
      const nextStep = currentStep >= 6 ? 6 : currentStep + 1 || 0 + 1;
      const nextRepeat = getNewRepeatTimeByStep(nextStep);

      const data = {
        step: nextStep,
        repeat: nextRepeat,
      };

      dispatch(
        fetchUpdate({
          uid,
          id,
          data,
          showLoading: false,
        })
      );
    });
  }, [dispatch, uid, words, currentIndex, successful]);

  const getStatusByIndex = (
    index: number
  ): 'successful' | 'failed' | 'pending' => {
    if (successful.includes(index)) return 'successful';
    if (failed.includes(index)) return 'failed';
    return 'pending';
  };

  const handleRepeat = useCallback(() => {
    setFailed([...failed, currentIndex]);
    const newIndex = currentIndex + 1;
    if (!words[newIndex]) return;
    setCurrentIndex(newIndex);

    window.requestAnimationFrame(() => {
      let { id, step: currentStep } = words[currentIndex];
      if (currentStep === 0) {
        currentStep = 1;
      }
      const nextRepeat = getNewRepeatTimeByStep(currentStep);

      const data = {
        repeat: nextRepeat,
      };

      dispatch(
        fetchUpdate({
          uid,
          id,
          data,
          showLoading: false,
        })
      );
    });
  }, [currentIndex, words, dispatch, uid, failed]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>{`${t('CARDS.TITLE')}`}</h2>
        <div className={styles.progressBarContainer}>
          <p className={styles.count}>{`${currentIndex + 1}/${
            words.length
          }`}</p>
          <BorderLinearProgress
            variant="determinate"
            value={words.length ? (100 / words.length) * (currentIndex + 1) : 0}
          />
        </div>
      </header>
      <div className={styles.container}>
        <button
          type="button"
          className={`${styles.button} ${
            currentIndex === 0 ? styles.hidden : ''
          }`}
        >
          <ArrowBackIcon onClick={back} />
        </button>

        <div className={styles.sliderContainer}>
          <Carousel value={currentIndex}>
            {words.map(({ id, word, translate }, index) => (
              <div key={id}>
                <Card
                  word={word}
                  translate={translate}
                  isActive={index === currentIndex}
                  status={getStatusByIndex(index)}
                />
                <div className={styles.controls}>
                  <button
                    onClick={handleDone}
                    className={`${styles.cardButton} ${styles.done}`}
                    type="button"
                    disabled={
                      successful.includes(index) || failed.includes(index)
                    }
                  >
                    <span aria-label="done">
                      <CheckIcon /> {t('CARDS.DONE')}
                    </span>
                  </button>
                  <button
                    onClick={handleRepeat}
                    className={`${styles.cardButton} ${styles.fail}`}
                    type="button"
                    disabled={
                      successful.includes(index) || failed.includes(index)
                    }
                  >
                    <span aria-label="done">
                      <CloseIcon /> {t('CARDS.FAIL')}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
        <button
          type="button"
          className={`${styles.button} ${
            currentIndex === words.length - 1 ? styles.hidden : ''
          }`}
          onClick={next}
        >
          <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
};

export default Cards;
