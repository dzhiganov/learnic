import firebase from 'firebase';
import { firestore as firestoreAdmin } from 'firebase-admin/lib/firestore';
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
      date: date ? date?.toDate()?.toString() : null,
      repeat: repeat ? repeat?.toDate()?.toString() : null,
    }));

    if (onlyTrainings) {
      return prepared.filter(({ step = 0, repeat = null }) => {
        const repeatDate = repeat ? new Date(repeat) : null;
        return step === 0 || (repeatDate && repeatDate < new Date());
      });
    }
    return prepared;
  }

  static async getWord({
    uid,
    id,
  }: {
    uid: string;
    id: string;
  }): Promise<WordSchema | null> {
    const wordRef = firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(id);

    const updatedWord = await wordRef.get();

    if (!updatedWord.exists) {
      return null;
    }
    return updatedWord.data() as WordSchema;
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
    id,
    updatedFields,
  }: {
    uid: string;
    id: string;
    updatedFields: {
      word?: string;
      translate?: string;
      example?: string;
      repeat?: string | Timestamp;
      step?: number;
      tags?: string;
    };
  }): Promise<Record<string, unknown>> {
    (await Words.getWords(uid)).forEach(({ id: wordId }) => {
      const wordRef = firestore
        .collection('users')
        .doc(uid)
        .collection('words')
        .doc(wordId);

      wordRef.update({
        tags: [{ name: 'test-tag', color: 'green' }],
      });
    });

    const updateObject = {
      ...omit(updatedFields, ['examples', 'repeat', 'tags']),
    } as {
      word?: string;
      translate?: string;
      examples?: firebase.firestore.FieldValue;
      repeat?: Date;
      step?: number;
      tags?: firebase.firestore.FieldValue;
    };

    if (updatedFields.example) {
      updateObject.examples = firestoreAdmin.FieldValue.arrayUnion(
        updatedFields.example
      );
    }

    if (updatedFields.tags) {
      const [TEMPORARY_FLAG, tagForRemove] = updatedFields.tags.split('_');

      if (TEMPORARY_FLAG === '!REMOVE!') {
        updateObject.tags = firestoreAdmin.FieldValue.arrayRemove(tagForRemove);
      } else {
        updateObject.tags = firestoreAdmin.FieldValue.arrayUnion(
          updatedFields.tags
        );
      }
    }

    if (updatedFields.repeat) {
      updateObject.repeat = new Date(updatedFields.repeat as string);
    }

    const wordRef = firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(id);

    await wordRef.update(updateObject);
    const updatedWord = await Words.getWord({ uid, id });

    return {
      uid,
      updatedWord: { id, ...updatedWord },
    };
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
