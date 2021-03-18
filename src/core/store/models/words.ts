import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import { getWords, deleteWord, addNewWord, update } from '../api/words';

export type Word = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
  audio?: string;
  examples: string[];
};

export type Words = Word[];

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
    getLoadingEnd(state) {
      state.isLoading = false;
    },
    getWordsSuccess(state, action: PayloadAction<Words>) {
      state.all = action.payload;
    },
    getTrainingWords(state) {
      state.training = state.all.filter(({ step = 0, repeat = null }) => {
        const repeatDate = repeat ? new Date(repeat) : null;
        return step === 0 || (repeatDate && repeatDate < new Date());
      });
    },
  },
});

export const {
  getLoadingStart,
  getLoadingEnd,
  getWordsSuccess,
  getTrainingWords,
} = issuesDisplaySlice.actions;

export default issuesDisplaySlice.reducer;

export const fetchWords = (uid: string): AppThunk => async (dispatch) => {
  dispatch(getLoadingStart());
  const all = (await getWords(uid)) as Words;

  dispatch(getWordsSuccess(all));
  dispatch(getTrainingWords());
  dispatch(getLoadingEnd());

  return all;
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
  dispatch(fetchWords(uid));
  dispatch(getLoadingEnd());
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
  dispatch(fetchWords(uid));
  dispatch(getLoadingEnd());
};

export const fetchUpdate = ({
  uid,
  id,
  data,
  // TODO move options to the top level
  showLoading = true,
}: {
  uid: string;
  id: string;
  data: {
    word?: string;
    translate?: string;
    repeat?: Date;
    step?: number;
  };
  showLoading?: boolean;
}): AppThunk => async (dispatch) => {
  if (showLoading) {
    dispatch(getLoadingStart());
  }
  await update({ uid, wordId: id, updatedFields: data });
  dispatch(fetchWords(uid));
  dispatch(getLoadingEnd());
};
