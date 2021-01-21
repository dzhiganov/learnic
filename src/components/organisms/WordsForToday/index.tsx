import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import shuffle from 'lodash.shuffle';
import dayjs from 'dayjs';
import styles from './styles.module.css';
import type { User } from '../../../core/store/models/user';
import { firestore } from '../../../database';
import type { RootState } from '../../../core/store/rootReducer';
import Results from './Results';
import Trainings from './Trainings';
import SentencesTraining from './SentencesTraining';
import If from '../../atoms/If';
import TrainingTypes from './consts/trainingTypes';
import WordsTraining from './WordsTraining';
import NoWordsForToday from './NoWordsForToday';

type Word = {
  id: string;
  word: string;
  translate: string;
};

type Words = firebase.firestore.DocumentData[] & Word[];

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
  [TrainingTypes.Sentences]: (SentencesTraining as unknown) as React.ComponentType<TrainingProps>,
};

const wrapped = (ui: JSX.Element) => {
  return (
    <>
      <h2 className={styles.title}>Words For Today</h2>
      <div className={styles.container}>{ui}</div>
    </>
  );
};

const WordsForToday: React.FunctionComponent = () => {
  const [trainingType, setTrainingType] = useState<TrainingTypes | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [succesed, setSuccesed] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);

  const user = useSelector(({ user: userData }: RootState) => userData);

  const [{ value: words = [] }, fetch] = useAsyncFn(
    async (currentUser: User): Promise<Words> => {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error('UID must not be null');
      }
      const result: firebase.firestore.DocumentData[] = [];

      const requestByStep = firestore
        .collection('users')
        .doc(uid)
        .collection('words')
        .where('step', '==', 1);
      const snapshotByStep = await requestByStep.get();

      const requestByDate = firestore
        .collection('users')
        .doc(uid)
        .collection('words')
        .where(
          'repeat',
          '<',
          dayjs('12.22.2020 23:59:59', 'MM.DD.YYYY HH:mm:ss').toDate()
        )
        .where(
          'repeat',
          '>',
          dayjs('12.22.2020 00:00:00', 'MM.DD.YYYY HH:mm:ss').toDate()
        );
      const snapshotByDate = await requestByDate.get();

      snapshotByStep.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });

      snapshotByDate.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });

      return shuffle(result) as Words;
    },
    [],
    { loading: true }
  );

  useEffect(() => {
    console.log('LENGTH', words.length);
  }, [words]);

  const handleRepeat = useCallback(() => {
    setFailed([]);
    setSuccesed([]);
    setFinished(false);
    setStarted(true);
  }, []);

  const handleSelectTraining = useCallback((type: TrainingTypes) => {
    setStarted(true);
    setTrainingType(type);
  }, []);

  const updateWordStatuses = useCallback(
    async (currentUser: User) => {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error('UID must not be null');
      }

      succesed.forEach(async (id) => {
        const request = firestore
          .collection('users')
          .doc(uid)
          .collection('words')
          .doc(id);

        const doc = await request.get();
        const data = doc.data();

        request.update({
          step: data?.step + 1,
        });
      });
    },
    [succesed]
  );

  useEffect(() => {
    if (user) {
      fetch(user);
    }
  }, [fetch, user]);

  useEffect(() => {
    if (finished) {
      updateWordStatuses(user);
    }
  }, [finished, updateWordStatuses, user]);

  const handleSetSuccess = useCallback(
    (value) => setSuccesed([...succesed, value]),
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

  if (!words.length) {
    return wrapped(<NoWordsForToday />);
  }

  if (finished) {
    return wrapped(
      <Results
        results={[succesed.length, failed.length]}
        onRepeat={handleRepeat}
      />
    );
  }

  return wrapped(
    <>
      <If condition={started && Boolean(CurrentComponent)}>
        <CurrentComponent
          words={words as Words}
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

export type { Variants, Words, TrainingTypes, TrainingProps };
export default WordsForToday;
