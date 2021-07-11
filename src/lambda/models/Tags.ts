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

  static async addUserTag({
    uid,
    name,
    color,
  }: { uid: string } & Omit<Tag, 'id'>): Promise<{
    uid: string;
    tag: { id: string };
  }> {
    const ref = await firestore
      .collection('users')
      .doc(uid)
      .collection('tags')
      .add({
        name,
        color,
      });

    const snapshot = await ref.get();
    const data = snapshot.data();
    const newTagId = snapshot.id;

    return {
      uid,
      tag: {
        id: newTagId,
        ...data,
      },
    };
  }
}

export default Tags;
