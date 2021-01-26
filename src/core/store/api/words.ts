import firebase from 'firebase';
import { firestore } from '../../../database';

type Timestamp = firebase.firestore.Timestamp;

type Raw = {
  id: string;
  word: string;
  translate: string;
  date: Timestamp;
  repeat: Timestamp;
};

type Word = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
};

type Words = Word[];

const getWords = async (uid: string): Promise<Words> => {
  const result: Raw[] = [];
  const request = firestore.collection('users').doc(uid).collection('words');
  const response = await request.get();

  const mergeToResult = (
    doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  ) => result.push({ id: doc.id, ...doc.data() } as Raw);

  response.forEach(mergeToResult);

  return result.map(({ date = null, repeat = null, ...other }) => ({
    ...other,
    date: date ? date.toDate().toString() : null,
    repeat: repeat ? repeat.toDate().toString() : null,
  }));
};

const deleteWord = async ({
  uid,
  wordId,
}: {
  uid: string;
  wordId: string;
}): Promise<void> => {
  await firestore
    .collection('users')
    .doc(uid)
    .collection('words')
    .doc(wordId)
    .delete();
};

const addNewWord = async ({
  uid,
  word,
  translate,
}: {
  uid: string;
  word: string;
  translate: string;
}): Promise<void> => {
  const request = firestore.collection('users').doc(uid).collection('words');

  await request.add({
    word,
    translate,
    step: 0,
    date: new Date(),
    repeat: new Date(),
  });
};

export { getWords, deleteWord, addNewWord };
