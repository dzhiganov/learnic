import { combineReducers, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import user from './models/user';
import translate from './models/translate';

const rootReducer = combineReducers({
  user,
  translate,
});

export type Reducers = 'user' | 'translate' | 'words';

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default rootReducer;
