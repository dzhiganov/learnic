import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import database, { googleProvider } from '../../../database';

export type User = {
  status?: Statuses;
  uid: string;
  name: string;
  email: string;
  photoURL: string;
};

export enum Statuses {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Success = 'SUCCESS',
}

const initialState: User = {
  status: Statuses.Pending,
  uid: '',
  name: '',
  email: '',
  photoURL: '',
};

type FirebaseUser = {
  uid: string;
  displayName: string;
  email: string;
  providerData?: [
    {
      photoURL?: string;
    }
  ];
};

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    getUserChecking(state) {
      state.status = Statuses.Pending;
    },
    getUserSuccess(state, action: PayloadAction<User>) {
      const { uid, name, email, photoURL } = action.payload;
      state.uid = uid;
      state.name = name;
      state.email = email;
      state.status = Statuses.Success;
      state.photoURL = photoURL;
    },
    getUserFailed(state) {
      state.uid = '';
      state.status = Statuses.Failed;
    },
  },
});

export const {
  getUserSuccess,
  getUserFailed,
  getUserChecking,
} = issuesDisplaySlice.actions;

export default issuesDisplaySlice.reducer;

export const authWithGoogle = (): AppThunk => async (dispatch) => {
  dispatch(getUserChecking());

  database
    .auth()
    .signInWithPopup(googleProvider)
    .catch(() => {
      dispatch(getUserFailed());
    });
};

export const fetchFirebaseUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getUserChecking());

    // TODO should move to api
    database.auth().onAuthStateChanged((user) => {
      if (user) {
        const {
          uid,
          displayName: name,
          email,
          providerData = [],
        } = user as any;
        const { photoURL = '' } = providerData[0] as any;
        dispatch(getUserSuccess({ uid, name, email, photoURL }));
      } else {
        dispatch(getUserFailed());
      }
    });
  } catch (err) {
    dispatch(getUserFailed());
  }
};

export const logout = (): AppThunk => async (dispatch) => {
  database
    .auth()
    .signOut()
    .then(() => {
      // do something...
    })
    .catch(() => {
      dispatch(getUserFailed());
    });
};
