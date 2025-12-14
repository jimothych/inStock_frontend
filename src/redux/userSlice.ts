import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Receipt } from './apiSlice';

export type UserState = {
  photo: string | null;
  name: string | null;
  email: string | null;
  id: string | null;
  receiptsList: Receipt[] | null;
  currentNumProcessingDocs: number;
  isGlobalLoading: boolean;
}

const initialState: UserState = {
  photo: null,
  name: null,
  email: null,
  id: null,
  receiptsList: null,
  currentNumProcessingDocs: 0,
  isGlobalLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    setCurrentNumProcessingDocs(state, action: PayloadAction<number>) {
      state.currentNumProcessingDocs = action.payload;
    },
    setReceiptsList(state, action: PayloadAction<Receipt[] | null>) {
      state.receiptsList = action.payload;
    },
    setIsGlobalLoading(state, action: PayloadAction<boolean>) {
      state.isGlobalLoading = action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser, setCurrentNumProcessingDocs, setReceiptsList, setIsGlobalLoading } = userSlice.actions;
export default userSlice.reducer;
