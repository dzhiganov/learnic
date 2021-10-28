import { firestore } from '../database';

type Example = {
  id: string;
  text: string;
};

type AddExampleResult = {
  wordId: string;
  example: Example;
};

class Examples {
  public static async addExample(
    uid: string,
    wordId: string,
    { text }: { text: string }
  ): Promise<AddExampleResult> {
    const wordDoc = firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(wordId);

    const exampleRef = await wordDoc.collection('examples').add({
      text,
    });
    const { id } = exampleRef;
    const snapshot = await exampleRef.get();
    const data = snapshot.data() as { text: string };

    return {
      wordId,
      example: {
        id,
        ...data,
      },
    };
  }

  public static updateExample(
    uid: string,
    wordId: string,
    { id, text }: { id: string; text: string }
  ): Promise<Example> {
    const wordDoc = firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(wordId);

    return wordDoc
      .collection('examples')
      .doc(id)
      .update({
        text,
      })
      .then(() => ({
        id,
        text,
      }));
  }

  public static async deleteExample(
    uid: string,
    wordId: string,
    id: string
  ): Promise<string> {
    const wordDoc = firestore
      .collection('users')
      .doc(uid)
      .collection('words')
      .doc(wordId);

    await wordDoc.collection('examples').doc(id).delete();

    return id;
  }
}

export default Examples;
