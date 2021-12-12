import firebase from 'firebase';
import { firestore as firestoreAdmin } from 'firebase-admin/lib/firestore';
import omit from 'lodash.omit';
import dayjs from 'dayjs';
import { firestore } from '../database';
import Dictionary from './Dictionary';

const { getDefinition } = Dictionary;

type Timestamp = firebase.firestore.Timestamp;

type Example = {
  id: string;
  text: string;
};

type Raw = {
  id: string;
  word: string;
  translate: string;
  date: Timestamp;
  repeat: Timestamp;
  step: number;
  audio: string;
  tags: firestoreAdmin.DocumentReference[];
  examples: Example[];
};

export type WordSchema = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
  examples?: Example[];
  audio: string;
  tags?: { id: string; name: string; color: string }[];
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
  ): { examples: string[]; audio: string; transcription: string } {
    const [wordData] = data;
    const { meanings, phonetics: phoneticsList } = wordData;
    const [phonetics] = phoneticsList;
    const { audio, text: transcription } = phonetics;

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
      transcription: transcription as string,
    };
  }

  static async getDefinition(
    keyword: string
  ): Promise<{
    examples: string[];
    audio: string;
    transcription: string;
  }> {
    try {
      const data = await getDefinition(keyword);

      if (data && Array.isArray(data)) {
        const {
          examples: resExamples,
          audio: resAudio,
          transcription,
        } = Words.getExamples(data);

        return {
          examples: resExamples,
          audio: resAudio as string,
          transcription,
        };
      }

      return {
        examples: [],
        audio: '',
        transcription: '',
      };
    } catch (error) {
      return {
        examples: [],
        audio: '',
        transcription: '',
      };
    }
  }

  static async prepareWord({
    tags: tagsRef,
    date,
    repeat,
    ...other
  }: Raw): Promise<{
    date: string | null;
    repeat: string | null;
    tags: { id: string; name: string; color: string }[];
    id: string;
    word: string;
    translate: string;
    step: number;
    audio: string;
    examples: Example[];
  }> {
    const tags = tagsRef
      ? await Promise.all(tagsRef.map((tagRef) => tagRef.get()))
      : [];

    return {
      ...other,
      date: date ? date?.toDate()?.toString() : null,
      repeat: repeat ? repeat?.toDate()?.toString() : null,
      tags: tags
        .map((snapshot) => {
          return { id: snapshot.id, ...snapshot.data() };
        })
        .filter((it) => it) as {
        id: string;
        name: string;
        color: string;
      }[],
    };
  }

  static sortByDate(words: WordSchemas): WordSchemas {
    return words.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      const firstDate = dayjs(a.date);
      const secondDate = dayjs(b.date);

      if (firstDate.isBefore(secondDate)) return 1;
      if (firstDate.isAfter(secondDate)) return -1;

      return 0;
    });
  }

  static async getWords(
    uid: string,
    onlyTrainings = false
  ): Promise<WordSchemas> {
    const promises: Promise<Raw>[] = [];
    let result: Raw[] = [];
    const request = firestore.collection('users').doc(uid).collection('words');
    const response = await request.get();

    response.forEach((snapshot) => {
      promises.push(
        (async () => {
          const examples: Example[] = [];
          const examplesResponse = await snapshot.ref
            .collection('examples')
            .get();
          examplesResponse.forEach((it) => {
            examples.push({
              id: it.id,
              ...it.data(),
            } as Example);
          });

          return {
            id: snapshot.id,
            ...snapshot.data(),
            examples,
          } as Raw;
        })()
      );
    });

    result = await Promise.all(promises);

    const prepared = await Promise.all(result.map(Words.prepareWord));

    if (onlyTrainings) {
      const filtered = prepared.filter(({ step = 0, repeat = null }) => {
        const repeatDate = repeat ? new Date(repeat) : null;
        return step === 0 || (repeatDate && repeatDate < new Date(Date.now()));
      });
      return Words.sortByDate(filtered);
    }
    return Words.sortByDate(prepared);
  }

  static async getWord({
    uid,
    id,
  }: {
    uid: string;
    id: string;
  }): Promise<ReturnType<typeof Words.prepareWord> | null> {
    const wordRef = firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(id);

    const wordDoc = await wordRef.get();

    if (!wordDoc.exists) {
      return null;
    }
    return Words.prepareWord({ id: wordDoc.id, ...wordDoc.data() } as Raw);
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
    const { audio = '', transcription = '' } = await Words.getDefinition(word);

    const ref = await request.add({
      word,
      translate,
      step: 0,
      date: new Date(),
      repeat: new Date(),
      audio,
      transcription,
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
      tags?: [string[], string[]];
    };
  }): Promise<Record<string, unknown>> {
    const current = await Words.getWord({ uid, id });
    const updateObject = {
      ...omit(updatedFields, ['examples', 'repeat', 'tags']),
    } as {
      word?: string;
      translate?: string;
      examples?: firebase.firestore.FieldValue;
      repeat?: Date;
      step?: number;
      tags?: firestoreAdmin.DocumentReference[];
    };

    if (updatedFields.example) {
      updateObject.examples = firestoreAdmin.FieldValue.arrayUnion(
        updatedFields.example
      );
    }

    if (updatedFields.tags) {
      const [addedTags = [], removedTags = []] = updatedFields.tags;

      // TODO Optimize it!
      const currentTags = current?.tags;
      const filteredTags = removedTags.length
        ? currentTags?.filter(
            ({ id: tagId }) => !removedTags.includes(tagId)
          ) || []
        : currentTags || [];
      const flatted = filteredTags.map(({ id: tagId }) => tagId);
      const newTags = [...flatted, ...addedTags].map(async (tagId) => {
        const docTag = await firestore.collection('tags').doc(tagId).get();
        const isDefaultTag = docTag.exists;

        if (isDefaultTag) {
          return firestore.collection('tags').doc(tagId);
        }

        return firestore
          .collection('users')
          .doc(uid)
          .collection('tags')
          .doc(tagId);
      });

      updateObject.tags = await Promise.all(newTags);
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
