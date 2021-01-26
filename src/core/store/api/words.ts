import firebase from 'firebase';
import { firestore } from '../../../database';

const getWords = async (uid: string): Promise<any[]> => {
  const result: any[] = [];
  const request = firestore.collection('users').doc(uid).collection('words');
  const response = await request.get();

  const mergeToResult = (
    doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  ) => result.push({ id: doc.id, ...doc.data() });

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
