/* eslint-disable css-modules/no-undef-class */
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { useQuery, useMutation } from '@apollo/client';
import groupBy from 'lodash.groupby';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Skeleton from '@material-ui/lab/Skeleton';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useParams } from 'react-router-dom';
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
import { GetWordsQueryResult, TrainingTypes } from '~shared/types';
import Selector from './Selector';
import getWords from '~graphql/queries/getWords';

const now = dayjs();
dayjs.extend(isSameOrAfter);

const Cards: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const uid = useSelector<string>('user.uid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [successful, setSuccessful] = useState<number[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);

  const { training, cardId } = useParams<{
    training: TrainingTypes;
    cardId: string;
  }>();
  const [selectedTraining, selectTraining] = useState<TrainingTypes | null>(
    () => {
      return training || null;
    }
  );
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

  const wordSets = useMemo(() => {
    const prepared = words.map(({ date, ...props }) => ({
      date: dayjs(date as string).format('YYYY.MM.DD'),
      ...props,
    }));
    const groupedByDate = groupBy(prepared, 'date');
    const sortedKeys = Object.keys(groupedByDate).sort((a, b) =>
      dayjs(a).isBefore(dayjs(b)) ? 1 : -1
    );

    const [lastKeys] = sortedKeys;
    const repeatWords = words.filter(({ repeat }) => {
      if (repeat) {
        return now.isSameOrAfter(dayjs(repeat));
      }

      return repeat;
    });

    return {
      [TrainingTypes.Repeat]: repeatWords,
      [TrainingTypes.All]: words,
      [TrainingTypes.Last]: groupedByDate[lastKeys],
    };
  }, [words]);

  useEffect(() => {
    if (cardId && !loading && selectedTraining) {
      const current = wordSets[selectedTraining as TrainingTypes].findIndex(
        ({ id }) => id === cardId
      );
      if (current !== -1) setCurrentIndex(current);
    }
  }, [cardId, loading, selectedTraining, wordSets]);

  const handleSelectTraining = (trainingType: TrainingTypes) => {
    selectTraining(trainingType);
    wordsAmount.current = wordSets[trainingType].length;
  };

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
    setSuccessful((prev) => [...prev, currentIndex]);
    const oldIndex = currentIndex;
    const newIndex = currentIndex + 1;

    if (newIndex === wordSets[selectedTraining as TrainingTypes].length) {
      setFinished(true);
    }

    setCurrentIndex(newIndex);

    window.requestAnimationFrame(() => {
      const { id, step: currentStep } = wordSets[
        selectedTraining as TrainingTypes
      ][oldIndex];
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
  }, [uid, currentIndex, fetchUpdate, wordSets, selectedTraining]);

  const handleAgain = useCallback(() => {
    setFailed((prev) => [...prev, currentIndex]);
    const newIndex = currentIndex + 1;
    const oldIndex = currentIndex;

    if (newIndex === wordSets[selectedTraining as TrainingTypes].length) {
      setFinished(true);
    }

    setCurrentIndex(newIndex);

    window.requestAnimationFrame(() => {
      const { id } = wordSets[selectedTraining as TrainingTypes][oldIndex];
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
  }, [currentIndex, uid, fetchUpdate, selectedTraining, wordSets]);

  const handleFail = useCallback(() => {
    setFailed((prev) => [...prev, currentIndex]);
    const newIndex = currentIndex + 1;
    const oldIndex = currentIndex;

    if (newIndex === wordSets[selectedTraining as TrainingTypes].length) {
      setFinished(true);
    }

    setCurrentIndex(newIndex);

    window.requestAnimationFrame(() => {
      const { id } = wordSets[selectedTraining as TrainingTypes][oldIndex];
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
  }, [currentIndex, uid, fetchUpdate, selectedTraining, wordSets]);

  const handleShowDefinition = (value: boolean) => {
    setShowDefinition(value);
  };

  const handleCloseDefinition = () => {
    setShowDefinition(false);
  };

  const handleOnChangeSlide = (newSlideIndex: number) =>
    setCurrentIndex(newSlideIndex);

  const handleBackToTheList = () => {
    selectTraining(null);
    setCurrentIndex(0);
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
          <Skeleton animation="wave" variant="rect" width={250} height={250} />
          <Skeleton animation="wave" variant="rect" width={250} height={250} />
        </div>
      </div>
    );
  }

  if ((!words.length && !loading) || finished) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.trainingHeader}>
          <button
            type="button"
            className={styles.backToTheListButton}
            onClick={handleBackToTheList}
          >
            <ArrowBackIosIcon /> Back
          </button>
        </header>
        <InfoBlock />
      </div>
    );
  }

  if (selectedTraining && !finished) {
    const wordsSet = wordSets[selectedTraining as TrainingTypes];

    if (wordsSet[currentIndex]) {
      const { examples: currentExamples = [] } = wordsSet[currentIndex];
      return (
        <div className={styles.wrapper}>
          <Definition
            title={wordsSet[currentIndex].word}
            examples={wordsSet[currentIndex].examples}
            open={showDefinition}
            onClose={handleCloseDefinition}
          />
          <header className={styles.trainingHeader}>
            <button
              type="button"
              className={styles.backToTheListButton}
              onClick={handleBackToTheList}
            >
              <ArrowBackIosIcon /> Back
            </button>
            <div className={styles.progressBarContainer}>
              <p className={styles.count}>
                <span>{`${currentIndex + 1}`}</span>
                <span>{` / ${wordsAmount.current}`}</span>
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
                {(wordsSet as {
                  id: string;
                  word: string;
                  translate: string;
                  audio: string;
                }[]).map(({ id, word, translate, audio }, index) => (
                  <div key={id}>
                    <Card
                      word={word}
                      translate={translate}
                      isActive={index === currentIndex}
                      audio={audio as string}
                      setShowDefinition={
                        currentExamples.length
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
                currentIndex === wordsSet.length - 1 ? styles.hidden : ''
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

  if (!selectedTraining) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.trainingHeader}>
          <h1 className={styles.title}>Select training</h1>
        </header>
        <Selector
          counts={{
            [TrainingTypes.Last]: wordSets.last.length,
            [TrainingTypes.All]: wordSets.all.length,
            [TrainingTypes.Repeat]: wordSets.repeat.length,
          }}
          onSelect={handleSelectTraining}
        />
      </div>
    );
  }

  return null;
};

export default Cards;
