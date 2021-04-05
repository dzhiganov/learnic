import { ColorSchemes } from '~/utils/colorSchemeContext';
import { firestore } from '../../../database';

type UserOptions = {
  colorScheme: ColorSchemes | 'default';
  language: 'en' | 'ru' | 'default';
};

const getUserOptions = async (uid: string): Promise<UserOptions> => {
  const doc = await firestore.collection('users').doc(uid).get();

  return doc.data() as UserOptions;
};

const updateUserOptions = (
  uid: string,
  updatedFields: Partial<UserOptions>
): Promise<void> => {
  return firestore.collection('users').doc(uid).update(updatedFields);
};

export type { UserOptions };
export { getUserOptions, updateUserOptions };
