import { firestore } from '../database';

// TODO Fix shared types and remove all any

class User {
  static async getUser(
    uid: string
  ): Promise<{
    language: string;
    colorScheme: string;
  }> {
    const doc = await firestore.collection('users').doc(uid).get();
    const userData = doc.data() as {
      language: string;
      colorScheme: string;
    };

    return userData;
  }

  static async updateUser(
    uid: string,
    updatedFields: {
      language?: string;
      colorScheme?: string;
    }
  ): Promise<unknown> {
    return firestore.collection('users').doc(uid).update(updatedFields);
  }
}

export default User;
