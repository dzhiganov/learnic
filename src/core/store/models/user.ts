import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    uid: '',
  },
};

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    setUser(state, action) {
      const { user } = action.payload;
      state.user = user;
    },
  },
});

export const { setUser } = issuesDisplaySlice.actions;

export default issuesDisplaySlice.reducer;
