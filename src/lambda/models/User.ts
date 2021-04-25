import { firestore } from '../database';

type UserOptions = {
  language: string;
  colorScheme: string;
};

type UserModel = {
  uid: string;
  userOptions: UserOptions;
};

class User {
  static async getUser(uid: string): Promise<UserModel> {
    const doc = await firestore.collection('users').doc(uid).get();
    const userOptions = doc.data() as UserOptions;

    return {
      uid,
      userOptions,
    };
  }

  static async updateUser(
    uid: string,
    updatedFields: Partial<UserOptions>
  ): Promise<unknown> {
    return firestore.collection('users').doc(uid).update(updatedFields);
  }
}

export default User;
