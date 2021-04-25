import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import database, { googleProvider } from '../../../database';

type UserDatabaseScheme = {
  uid: string;
  displayName: string;
  email: string;
  providerData: { photoURL: string }[];
};

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

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    getUserChecking(state) {
      state.status = Statuses.Pending;
    },
    getUserSuccess(
      state,
      { payload: { uid, name, email, photoURL } }: PayloadAction<User>
    ) {
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
    database.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const {
          uid,
          displayName: name,
          email,
          providerData = [],
        } = user as UserDatabaseScheme;

        const { photoURL = '' } = providerData[0];

        dispatch(
          getUserSuccess({
            uid,
            name,
            email,
            photoURL,
          })
        );
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
