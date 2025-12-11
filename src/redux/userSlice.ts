import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../global_components/global';

const initialState: UserState = {
  photo: null,
  name: null,
  email: null,
  id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
