import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import firebase from 'firebase';
import shuffle from 'lodash.shuffle';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import Results from './Results';
import Trainings from './Trainings';
import If from '~c/atoms/If';
import TrainingTypes from './consts/trainingTypes';
import WordsTraining from './WordsTraining';
import NoWordsForToday from './NoWordsForToday';
import getNewRepeatTimeByStep from './utils/getNewRepeatTimeByStep';
import useSelector from '~hooks/useSelector';
import { fetchUpdate, fetchWords } from '~actions/words';

type Word = firebase.firestore.DocumentData & {
  id: string;
  word: string;
  translate: string;
  examples: string[];
};

type Words = Word[];

type Variants = [string, string, string, string];

type TrainingProps = {
  setStarted: (started: boolean) => void;
  setFinished: (finished: boolean) => void;
  setFailed: (id: string) => void;
  setSuccesed: (id: string) => void;
  words: Words;
  onBack: () => void;
};

const trainingComponents = {
  [TrainingTypes.Words]: (WordsTraining as unknown) as React.ComponentType<TrainingProps>,
};

const Wrapper = (ui: JSX.Element) => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t('TRAINING.TITLE')}</h2>
      <div className={styles.container}>{ui}</div>
    </div>
  );
};

const WordsForToday: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [trainingType, setTrainingType] = useState<TrainingTypes | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [succesed, setSuccesed] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const uid = useSelector('user.uid');
  const words = useSelector('words.training') as Words;
  const wordsRef = useRef<Words>([]);
  wordsRef.current = words;

  const shuffledWords = useMemo(() => shuffle(words), [words]);

  const handleRepeat = useCallback(() => {
    setFailed([]);
    setSuccesed([]);
    setFinished(false);
    setStarted(true);
    dispatch(fetchWords(uid));
  }, [dispatch, uid]);

  const handleSelectTraining = useCallback((type: TrainingTypes) => {
    setStarted(true);
    setTrainingType(type);
  }, []);

  const updateWordStatuses = useCallback(async () => {
    succesed.forEach(async (id) => {
      const currentWord = wordsRef.current.find(
        ({ id: itemId }) => id === itemId
      );
      // TODO Fix that. When word has step 6 it should be archived
      const nextStep =
        currentWord?.step >= 6 ? 6 : currentWord?.step + 1 || 0 + 1;
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
  }, [dispatch, succesed, uid]);

  useEffect(() => {
    if (finished && succesed.length) {
      updateWordStatuses();
    }
  }, [finished, updateWordStatuses, succesed]);

  const handleSetSuccess = useCallback(
    (value) => {
      setSuccesed([...succesed, value]);
    },
    [succesed]
  );

  const handleSetFailed = useCallback(
    (value) => setFailed([...failed, value]),
    [failed]
  );

  const CurrentComponent = useMemo(
    (): React.ComponentType<TrainingProps> =>
      trainingComponents[trainingType as TrainingTypes],
    [trainingType]
  );

  const handleBack = useCallback(() => {
    setFailed([]);
    setSuccesed([]);
    setFinished(false);
    setStarted(false);
  }, []);

  if (finished) {
    return Wrapper(
      <Results
        results={[succesed.length, failed.length]}
        onRepeat={handleRepeat}
      />
    );
  }

  if (!words.length) {
    return Wrapper(<NoWordsForToday />);
  }

  return Wrapper(
    <>
      <If condition={started && Boolean(CurrentComponent)}>
        <CurrentComponent
          words={shuffledWords as Words}
          setStarted={setStarted}
          setFinished={setFinished}
          setSuccesed={handleSetSuccess}
          setFailed={handleSetFailed}
          onBack={handleBack}
        />
      </If>
      <If condition={!started}>
        <Trainings onSelectTraining={handleSelectTraining} />
      </If>
    </>
  );
};

export type { Word, Variants, Words, TrainingTypes, TrainingProps };
export default WordsForToday;
