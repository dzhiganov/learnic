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
import NoWordsForToday from './NoWordsForToday';
import getNewRepeatTimeByStep from './utils/getNewRepeatTimeByStep';
import queryBuilder from './utils/queryBuilder';

type Word = firebase.firestore.DocumentData & {
  id: string;
  word: string;
  translate: string;
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

      const query = queryBuilder(uid);
      const snapshotByStep = await query(['step', '==', 0]);
      const snapshotByDate = await query(['repeat', '<=', new Date()]);

      const mergeToResult = (
        doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
      ) => result.push({ id: doc.id, ...doc.data() });

      [snapshotByStep, snapshotByDate].forEach((snap) =>
        snap.forEach(mergeToResult)
      );

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

        // TODO Fix that. When word has step 6 it should be archived
        const nextStep = data?.step >= 6 ? 6 : data?.step || 0 + 1;
        const nextRepeat = getNewRepeatTimeByStep(nextStep);

        request.update({
          step: nextStep,
          repeat: nextRepeat,
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

export type { Word, Variants, Words, TrainingTypes, TrainingProps };
export default WordsForToday;
