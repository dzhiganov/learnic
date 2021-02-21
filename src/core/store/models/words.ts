import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import { getWords, deleteWord, addNewWord, update } from '../api/words';

export type Words = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
}[];

type State = {
  all: Words;
  training: Words;
  isLoading: boolean;
};

const initialState: State = {
  all: [],
  training: [],
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
    getTrainingWords(state, action: PayloadAction<Words>) {
      state.training = action.payload;
    },
  },
});

export const {
  getLoadingStart,
  getWordsSuccess,
  getTrainingWords,
} = issuesDisplaySlice.actions;

export default issuesDisplaySlice.reducer;

export const fetchWords = (uid: string): AppThunk => async (dispatch) => {
  dispatch(getLoadingStart());
  const all = await getWords(uid);
  const training = all.filter(({ step = 0, repeat = null }) => {
    const repeatDate = repeat ? new Date(repeat) : null;
    return step === 0 || (repeatDate && repeatDate < new Date());
  });
  dispatch(getWordsSuccess(all));
  dispatch(getTrainingWords(training));
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

export const fetchUpdate = ({
  uid,
  id,
  data,
}: {
  uid: string;
  id: string;
  data: {
    word: string;
    translate: string;
  };
}): AppThunk => async (dispatch) => {
  dispatch(getLoadingStart());
  await update({ uid, wordId: id, updatedFields: data });
  const all = await getWords(uid);
  dispatch(getWordsSuccess(all));
};
