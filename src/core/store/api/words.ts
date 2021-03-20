import firebase from 'firebase';
import omit from 'lodash.omit';
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

type WordSchema = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
  examples?: string[];
};

type WordSchemas = WordSchema[];

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
  try {
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
  } catch (error) {
    return {
      examples: [],
      audio: '',
    };
  }
};

const getWords = async (
  uid: string,
  onlyTraingins = false
): Promise<WordSchemas> => {
  const result: Raw[] = [];
  const request = firestore.collection('users').doc(uid).collection('words');
  const response = await request.get();

  const mergeToResult = (
    doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  ) => result.push({ id: doc.id, ...doc.data() } as Raw);

  response.forEach(mergeToResult);

  const prepared = result.map(({ date = null, repeat = null, ...other }) => ({
    ...other,
    date: date ? date.toDate().toString() : null,
    repeat: repeat ? repeat.toDate().toString() : null,
  }));

  if (onlyTraingins) {
    return prepared.filter(({ step = 0, repeat = null }) => {
      const repeatDate = repeat ? new Date(repeat) : null;
      return step === 0 || (repeatDate && repeatDate < new Date());
    });
  }
  return prepared;
};

const update = ({
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
    repeat?: Date;
    step?: number;
  };
}): Promise<void> => {
  const updateObject = {
    ...omit(updatedFields, 'examples'),
  } as {
    word?: string;
    translate?: string;
    example?: firebase.firestore.FieldValue;
    repeat?: Date;
    step?: number;
  };

  if (updatedFields.example) {
    updateObject.example = firebase.firestore.FieldValue.arrayUnion(
      updatedFields.example
    );
  }

  return firestore
    .collection('users')
    .doc(uid)
    .collection('words')
    .doc(wordId)
    .update(updateObject);
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
