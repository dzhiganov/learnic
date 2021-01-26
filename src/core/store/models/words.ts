import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import { getWords, deleteWord, addNewWord } from '../api/words';

export type Words = {
  id: string;
  word: string;
  translate: string;
}[];

type State = {
  all: Words;
  isLoading: boolean;
};

const initialState: State = {
  all: [],
  isLoading: false,
};

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    getLoadingStart(state) {
      state.isLoading = true;
    },
    getWordsSuccess(state, action: PayloadAction<Words>) {
      state.all = action.payload;
      state.isLoading = false;
    },
  },
});

export const { getLoadingStart, getWordsSuccess } = issuesDisplaySlice.actions;

export default issuesDisplaySlice.reducer;

export const fetchWords = (uid: string): AppThunk => async (dispatch) => {
  dispatch(getLoadingStart());
  const all = await getWords(uid);
  dispatch(getWordsSuccess(all));
};

export const fetchDeleteWord = ({
  uid,
  wordId,
}: {
  uid: string;
  wordId: string;
}): AppThunk => async (dispatch) => {
  dispatch(getLoadingStart());
  await deleteWord({ uid, wordId });
  const all = await getWords(uid);
  dispatch(getWordsSuccess(all));
};

export const fetchAddNewWord = ({
  uid,
  word,
  translate,
}: {
  uid: string;
  word: string;
  translate: string;
}): AppThunk => async (dispatch) => {
  dispatch(getLoadingStart());
  await addNewWord({ uid, word, translate });
  const all = await getWords(uid);
  dispatch(getWordsSuccess(all));
};
