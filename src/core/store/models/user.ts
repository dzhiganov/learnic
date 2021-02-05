import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import database from '../../../database';

export type User = {
  status: Statuses;
  uid: string;
  name: string;
  email: string;
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
};

type FirebaseUser = {
  uid: string;
  displayName: string;
  email: string;
};

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    getUserChecking(state) {
      state.status = Statuses.Pending;
    },
    getUserSuccess(state, action: PayloadAction<FirebaseUser>) {
      const { uid, displayName, email } = action.payload;
      state.uid = uid;
      state.name = displayName;
      state.email = email;
      state.status = Statuses.Success;
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

export const fetchFirebaseUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getUserChecking());

    // TODO should move to api
    database.auth().onAuthStateChanged((user) => {
      if (user) {
        const { uid, displayName, email } = user as FirebaseUser;
        dispatch(getUserSuccess({ uid, displayName, email }));
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
