import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Receipt } from './apiSlice';

export type UserState = {
  photo: string | null;
  name: string | null;
  email: string | null;
  id: string | null;
  receiptsList: Receipt[] | null;
  currentNumProcessingDocs: number;
}

const initialState: UserState = {
  photo: null,
  name: null,
  email: null,
  id: null,
  receiptsList: null,
  currentNumProcessingDocs: 0,
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
    clearUser() {
      return initialState;
    },
    //string in payload is receipt_id
    deleteReceipt(state, action: PayloadAction<string>) {
      if (!state.receiptsList) return; // guard clause
      state.receiptsList = state.receiptsList.filter( //make new array
        receipt => receipt.receipt_id !== action.payload
      );
    },
  },
});

export const { setUser, 
              clearUser, 
              setCurrentNumProcessingDocs, 
              setReceiptsList,
              deleteReceipt } = userSlice.actions;
export default userSlice.reducer;
