import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppThunk } from '..';

import { getTranslatorAuthKey } from '../api/wordData';

type UserState = {
  token: string;
  error: string;
};

const initialState: UserState = {
  token: '',
  error: '',
};

const repoDetails = createSlice({
  name: 'repoDetails',
  initialState,
  reducers: {
    getRepoDetailsSuccess(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.error = '';
    },
    getRepoDetailsFailed(state, action: PayloadAction<string>) {
      state.token = '';
      state.error = action.payload;
    },
  },
});

export const {
  getRepoDetailsSuccess,
  getRepoDetailsFailed,
} = repoDetails.actions;

export default repoDetails.reducer;

export const fetchAuth = (): AppThunk => async (dispatch) => {
  try {
    const apiKey = process.env.REACT_APP_LINGVOLIVE_API_KEY as string;
    const token = await getTranslatorAuthKey(apiKey);
    dispatch(getRepoDetailsSuccess(token));
  } catch (err: unknown) {
    dispatch(getRepoDetailsFailed(`${err}`));
  }
};
