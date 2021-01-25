import firebase from 'firebase';
import { firestore } from '../../../../database';

type WhereFilterOp = firebase.firestore.WhereFilterOp;
type DocumentData = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

const queryBuilder = (uid: string) => (
  where: [string, WhereFilterOp, string | number | Date]
): Promise<DocumentData> => {
  const [key, condition, value] = where;
  const requestByStep = firestore
    .collection('users')
    .doc(uid)
    .collection('words')
    .where(key, condition, value);
  return requestByStep.get();
};

export default queryBuilder;
