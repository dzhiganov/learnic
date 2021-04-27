import 'firebase/firestore';
import * as admin from 'firebase-admin';

const privateKey = process.env.REACT_APP_PRIVATE_KEY as any;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.REACT_APP_PROJECT_ID,
      privateKey: privateKey[0] === '-' ? privateKey : JSON.parse(privateKey),
      clientEmail: process.env.REACT_APP_CLIENT_EMAIL,
    }),
    databaseURL: process.env.REACT_APP_DATABASE_URL,
  });
}

const firestore = admin.firestore();

export { firestore };
