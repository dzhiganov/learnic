import firebase from 'firebase';
import { firestore } from '../../../database';
import { getDefinition } from './dictionary';

type Timestamp = firebase.firestore.Timestamp;

type Raw = {
  id: string;
  word: string;
  translate: string;
  date: Timestamp;
  repeat: Timestamp;
  step: number;
};

type Word = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
};

type Words = Word[];

export const getExamples = (
  data: Array<{
    meanings: Array<
      Record<string, unknown> & {
        definitions: Array<{ example: string }>;
      }
    >;
    phonetics: Array<Record<string, unknown>>;
  }>
): { examples: string[]; audio: string } => {
  const [wordData] = data;
  const { meanings, phonetics: phoneticsList } = wordData;
  const [phonetics] = phoneticsList;
  const { audio } = phonetics;

  const result = meanings.reduce(
    (
      acc: string[],
      item: Record<string, unknown> & {
        definitions: Array<{ example: string }>;
      }
    ) => {
      const { definitions } = item;
      definitions.forEach(({ example }) => acc.push(example));
      return acc;
    },
    []
  );

  return {
    examples: result,
    audio: audio as string,
  };
};

const fetchDefinition = async (
  keyword: string
): Promise<{
  examples: string[];
  audio: string;
}> => {
  const data = await getDefinition(keyword);

  if (data && Array.isArray(data)) {
    const { examples: resExamples, audio: resAudio } = getExamples(data);

    return {
      examples: resExamples,
      audio: resAudio as string,
    };
  }

  return {
    examples: [],
    audio: '',
  };
};

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

const update = async ({
  uid,
  wordId,
  updatedFields,
}: {
  uid: string;
  wordId: string;
  updatedFields: {
    word?: string;
    translate?: string;
    example?: string;
  };
}): Promise<void> => {
  const updateObject = {} as {
    word?: string;
    translate?: string;
    examples?: firebase.firestore.FieldValue;
  };

  if (updatedFields.example) {
    updateObject.examples = firebase.firestore.FieldValue.arrayUnion(
      updatedFields.example
    );
  }

  if (updatedFields.word) {
    updateObject.word = updatedFields.word;
  }

  if (updatedFields.translate) {
    updateObject.translate = updatedFields.translate;
  }

  await firestore
    .collection('users')
    .doc(uid)
    .collection('words')
    .doc(wordId)
    .update({
      ...updateObject,
    });
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
  const { examples, audio } = await fetchDefinition(word);

  await request.add({
    word,
    translate,
    step: 0,
    date: new Date(),
    repeat: new Date(),
    audio,
    examples: examples.filter((example: string) => example),
  });
};

export { getWords, deleteWord, update, addNewWord };
