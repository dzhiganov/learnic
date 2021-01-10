import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import shuffle from 'lodash.shuffle';
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

type Word = {
  word: string;
  translate: string;
};

type Words = firebase.firestore.DocumentData[] & Word[];

type Variants = [string, string, string, string];

type TrainingProps = {
  setStarted: (started: boolean) => void;
  setFinished: (finished: boolean) => void;
  setFailed: (data: Word) => void;
  setSuccesed: (data: Word) => void;
  words: Words;
  onBack: () => void;
};

const trainingComponents = {
  [TrainingTypes.Words]: (WordsTraining as unknown) as React.ComponentType<TrainingProps>,
  [TrainingTypes.Sentences]: (SentencesTraining as unknown) as React.ComponentType<TrainingProps>,
};

const WordsForToday: React.FunctionComponent = () => {
  const [trainingType, setTrainingType] = useState<TrainingTypes | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [succesed, setSuccesed] = useState<Words>([]);
  const [failed, setFailed] = useState<Words>([]);

  const user = useSelector(({ user: userData }: RootState) => userData);

  const [{ value: words }, fetch] = useAsyncFn(
    async (currentUser: User): Promise<Words> => {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error('UID must not be null');
      }
      const result: firebase.firestore.DocumentData[] = [];
      const start = new Date('12-22-2020');
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      const end = new Date();
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);

      const request = firestore
        .collection('users')
        .doc(uid)
        .collection('words')
        .where('repeat', '>', start)
        .where('repeat', '<', end);
      const snapshot = await request.get();

      if (snapshot.empty) {
        throw new Error('Snapshot is empty');
      }

      snapshot.forEach((doc) => {
        result.push(doc.data());
      });

      return shuffle(result) as Words;
    },
    [],
    { loading: true }
  );

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

  useEffect(() => {
    if (user) {
      fetch(user);
    }
  }, [fetch, user]);

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

  if (finished) {
    return (
      <>
        <h2 className={styles.title}>Words For Today</h2>
        <div className={styles.container}>
          <Results
            results={[succesed.length, failed.length]}
            onRepeat={handleRepeat}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className={styles.title}>Words For Today</h2>
      <div className={styles.container}>
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
      </div>
    </>
  );
};

export type { Variants, Words, TrainingTypes, TrainingProps };
export default WordsForToday;
