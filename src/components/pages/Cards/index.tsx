/* eslint-disable css-modules/no-undef-class */
import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { useQuery, useMutation } from '@apollo/client';
import Skeleton from '@material-ui/lab/Skeleton';
import useSelector from '~hooks/useSelector';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './styles.module.css';
import Card from './Card/Card';
import getNewRepeatTimeByStep, {
  getRepeatTimeIfFail,
  getRepeatTimeIfRepeatAgain,
} from './utils/getNewRepeatTimeByStep';
import InfoBlock from './InfoBlock';
import Definition from './Definition';
import updateWordMutation from '~graphql/mutations/updateWord';
import { GetWordsQueryResult } from '~shared/types';
import getWords from '~graphql/queries/getWords';

const Cards: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const uid = useSelector<string>('user.uid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [successful, setSuccessful] = useState<number[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [fetchUpdate] = useMutation(updateWordMutation);
  const wordsAmount = useRef(0);

  const {
    data: { user: { words = [] } = {} } = {},
    loading,
  } = useQuery<GetWordsQueryResult>(getWords, {
    variables: {
      uid,
    },
  });

  const handleSelectWord = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const back = useCallback(() => {
    const newIndex = currentIndex - 1;
    if (!words[newIndex]) return;
    handleSelectWord(newIndex);
  }, [currentIndex, words, handleSelectWord]);

  const next = useCallback(() => {
    const newIndex = currentIndex + 1;
    if (!words[newIndex]) return;
    handleSelectWord(newIndex);
  }, [currentIndex, words, handleSelectWord]);

  const handleDone = useCallback(() => {
    setSuccessful((prev) => [...prev, currentIndex]);
    const oldIndex = currentIndex;
    const newIndex = currentIndex + 1;

    if (newIndex === words.length) {
      setFinished(true);
    }

    handleSelectWord(newIndex);

    window.requestAnimationFrame(() => {
      const { id, step: currentStep } = words[oldIndex];
      const nextStep = currentStep >= 6 ? 6 : currentStep + 1 || 0 + 1;
      const nextRepeat = getNewRepeatTimeByStep(nextStep);

      const data = {
        step: nextStep,
        repeat: nextRepeat,
      };

      fetchUpdate({
        variables: {
          uid,
          id,
          updatedFields: data,
        },
      });
    });
  }, [uid, currentIndex, fetchUpdate, handleSelectWord, words]);

  const handleAgain = useCallback(() => {
    setFailed((prev) => [...prev, currentIndex]);
    const newIndex = currentIndex + 1;
    const oldIndex = currentIndex;

    if (newIndex === words.length) {
      setFinished(true);
    }

    handleSelectWord(newIndex);

    window.requestAnimationFrame(() => {
      const { id } = words[oldIndex];
      const nextRepeat = getRepeatTimeIfRepeatAgain();

      const data = {
        repeat: nextRepeat,
      };

      fetchUpdate({
        variables: {
          uid,
          id,
          updatedFields: data,
        },
      });
    });
  }, [currentIndex, uid, fetchUpdate, handleSelectWord, words]);

  const handleFail = useCallback(() => {
    setFailed((prev) => [...prev, currentIndex]);
    const newIndex = currentIndex + 1;
    const oldIndex = currentIndex;

    if (newIndex === words.length) {
      setFinished(true);
    }

    handleSelectWord(newIndex);

    window.requestAnimationFrame(() => {
      const { id } = words[oldIndex];
      const nextRepeat = getRepeatTimeIfFail();

      const data = {
        repeat: nextRepeat,
      };

      fetchUpdate({
        variables: {
          uid,
          id,
          updatedFields: data,
        },
      });
    });
  }, [currentIndex, uid, fetchUpdate, handleSelectWord, words]);

  const handleShowDefinition = (value: boolean) => {
    setShowDefinition(value);
  };

  const handleCloseDefinition = () => {
    setShowDefinition(false);
  };

  const handleOnChangeSlide = (newSlideIndex: number) =>
    handleSelectWord(newSlideIndex);

  const handleBackToTheList = () => {
    handleSelectWord(0);
    setSuccessful([]);
    setFailed([]);
    setFinished(false);
    wordsAmount.current = 0;
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.trainingHeader}>
          <h1 className={styles.title}>Select training</h1>
        </header>
        <div className={styles.skeletons}>
          <Skeleton animation="wave" variant="rect" width={250} height={250} />
        </div>
      </div>
    );
  }

  if ((!words.length && !loading) || finished) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.trainingHeader} />
        <InfoBlock />
      </div>
    );
  }

  if (!finished) {
    if (words[currentIndex]) {
      const { examples: currentExamples = [] } = words[currentIndex];
      return (
        <div className={styles.wrapper}>
          <Definition
            title={words[currentIndex].word}
            examples={words[currentIndex].examples}
            open={showDefinition}
            onClose={handleCloseDefinition}
          />
          <header className={styles.trainingHeader}>
            <div className={styles.progressBarContainer}>
              <p className={styles.count}>
                <span>{`${currentIndex + 1}`}</span>
                <span>{` / ${words.length}`}</span>
              </p>
            </div>
          </header>
          <div className={styles.container}>
            <button
              type="button"
              className={`${styles.button} ${styles.back} ${
                currentIndex === 0 ? styles.hidden : ''
              }`}
              onClick={back}
            >
              <ArrowBackIcon />
            </button>

            <div className={styles.sliderContainer}>
              <Carousel value={currentIndex} onChange={handleOnChangeSlide}>
                {words.map(({ id, word, translate, audio }, index) => (
                  <div key={id}>
                    <Card
                      word={word}
                      translate={translate}
                      isActive={index === currentIndex}
                      audio={audio as string}
                      setShowDefinition={
                        currentExamples?.length
                          ? handleShowDefinition
                          : undefined
                      }
                    />
                    <div>
                      <div className={styles.controlsHeader}>
                        <span>{t('CARDS.HOW_QUICKLY')}</span>
                      </div>
                      <div className={styles.controls}>
                        <button
                          onClick={handleDone}
                          className={`${styles.cardButton} ${styles.done}`}
                          type="button"
                          disabled={
                            successful.includes(index) || failed.includes(index)
                          }
                        >
                          {t('CARDS.DONE')}
                        </button>
                        <button
                          onClick={handleAgain}
                          className={`${styles.cardButton} ${styles.medium}`}
                          type="button"
                          disabled={
                            successful.includes(index) || failed.includes(index)
                          }
                        >
                          {t('CARDS.AGAIN')}
                        </button>
                        <button
                          onClick={handleFail}
                          className={`${styles.cardButton} ${styles.fail}`}
                          type="button"
                          disabled={
                            successful.includes(index) || failed.includes(index)
                          }
                        >
                          {t('CARDS.FAIL')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.next} ${
                currentIndex === words.length - 1 ? styles.hidden : ''
              }`}
              onClick={next}
            >
              <ArrowForwardIcon />
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default Cards;
