import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk } from '..';

import api from '../api/translate';

const initialState = {
  token: null,
  error: null,
};

const repoDetails = createSlice({
  name: 'repoDetails',
  initialState,
  reducers: {
    getRepoDetailsSuccess(state, action: PayloadAction<any>) {
      state.token = action.payload.token;
      state.error = null;
    },
    getRepoDetailsFailed(state, action: PayloadAction<any>) {
      state.token = null;
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
