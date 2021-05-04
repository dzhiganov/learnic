import firebase from 'firebase';
import omit from 'lodash.omit';
import { firestore } from '../database';
import Dictionary from './Dictionary';

const { getDefinition } = Dictionary;

type Timestamp = firebase.firestore.Timestamp;

type Raw = {
  id: string;
  word: string;
  translate: string;
  date: Timestamp;
  repeat: Timestamp;
  step: number;
  audio: string;
};

export type WordSchema = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
  examples?: string[];
  audio: string;
};

type WordSchemas = WordSchema[];

class Words {
  static getExamples(
    data: Array<{
      meanings: Array<
        Record<string, unknown> & {
          definitions: Array<{ example: string }>;
        }
      >;
      phonetics: Array<Record<string, unknown>>;
    }>
  ): { examples: string[]; audio: string } {
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
  }

  static async getDefinition(
    keyword: string
  ): Promise<{
    examples: string[];
    audio: string;
  }> {
    try {
      const data = await getDefinition(keyword);

      if (data && Array.isArray(data)) {
        const { examples: resExamples, audio: resAudio } = Words.getExamples(
          data
        );

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
  }

  static async getWords(
    uid: string,
    onlyTrainings = false
  ): Promise<WordSchemas> {
    const result: Raw[] = [];
    const request = firestore.collection('users').doc(uid).collection('words');
    const response = await request.get();

    response.forEach((doc) =>
      result.push({ id: doc.id, ...doc.data() } as Raw)
    );

    const prepared = result.map(({ date = null, repeat = null, ...other }) => ({
      ...other,
      date: date ? date.toDate().toString() : null,
      repeat: repeat ? repeat.toDate().toString() : null,
    }));

    if (onlyTrainings) {
      return prepared.filter(({ step = 0, repeat = null }) => {
        const repeatDate = repeat ? new Date(repeat) : null;
        return step === 0 || (repeatDate && repeatDate < new Date());
      });
    }
    return prepared;
  }

  static async addWord({
    uid,
    word,
    translate,
  }: {
    uid: string;
    word: string;
    translate: string;
  }): Promise<{
    uid: string;
    newWord: WordSchema;
  }> {
    const request = firestore.collection('users').doc(uid).collection('words');
    const { examples, audio } = await Words.getDefinition(word);

    const ref = await request.add({
      word,
      translate,
      step: 0,
      date: new Date(),
      repeat: new Date(),
      audio,
      examples: (examples as string[]).filter((example: string) => example),
    });
    const snapshot = await ref.get();
    const data = snapshot.data();
    const newWordId = snapshot.id;

    return {
      uid,
      newWord: {
        id: newWordId,
        ...data,
        repeat: data?.repeat?.toDate().toString(),
        date: data?.date?.toDate().toString(),
      } as WordSchema,
    };
  }

  static async updateWord({
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
  }): Promise<FirebaseFirestore.WriteResult> {
    const updateObject = {
      ...omit(updatedFields, 'examples'),
    } as {
      word?: string;
      translate?: string;
      examples?: firebase.firestore.FieldValue;
      repeat?: Date;
      step?: number;
    };

    if (updatedFields.example) {
      updateObject.examples = firebase.firestore.FieldValue.arrayUnion(
        updatedFields.example
      );
    }

    return firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(wordId)
      .update(updateObject);
  }

  static async deleteWord({
    uid,
    wordId,
  }: {
    uid: string;
    wordId: string;
  }): Promise<void> {
    await firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(wordId)
      .delete();
  }
}

export default Words;
