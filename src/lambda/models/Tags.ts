import { firestore } from '../database';

type Tag = {
  id: string;
  name: string;
  color: string;
};

class Tags {
  static async getUserTag(uid: string, tagId: string): Promise<Tag> {
    const request = firestore
      .collection('users')
      .doc(uid)
      .collection('tags')
      .doc(tagId);
    const response = await request.get();

    return response.data() as Tag;
  }

  static async getUserTags(uid: string): Promise<Tag[]> {
    const result: Tag[] = [];
    const request = firestore.collection('users').doc(uid).collection('tags');
    const response = await request.get();

    response.forEach((doc) =>
      result.push({ id: doc.id, ...doc.data() } as Tag)
    );

    return result;
  }

  static async getDefaultTags(): Promise<Tag[]> {
    const result: Tag[] = [];
    const request = firestore.collection('tags');
    const response = await request.get();

    response.forEach((doc) =>
      result.push({ id: doc.id, ...doc.data() } as Tag)
    );

    return result;
  }

  static async deleteUserTag(uid: string, tagId: string): Promise<void> {
    firestore
      .collection('users')
      .doc(uid)
      .collection('tags')
      .doc(tagId)
      .delete();
  }

  static async addUserTag(
    uid: string,
    { name, color }: Omit<Tag, 'id'>
  ): Promise<void> {
    firestore.collection('users').doc(uid).collection('tags').add({
      name,
      color,
    });
  }
}

export default Tags;
