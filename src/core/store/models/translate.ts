import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk } from '..';

import api from '../api/translate';

type UserState = {
  token: string;
  error: string;
};

const initialState = {
  token: '',
  error: '',
};

const repoDetails = createSlice({
  name: 'repoDetails',
  initialState,
  reducers: {
    getRepoDetailsSuccess(state, action: PayloadAction<UserState>) {
      state.token = action.payload.token;
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
    const auth = await api.auth(apiKey);
    dispatch(getRepoDetailsSuccess(auth));
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()));
  }
};
