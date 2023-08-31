import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { InitialState, Account } from "./accountTypes";
import { firestoreDb } from "../../api/fireStore";
import { collection, getDocs } from "firebase/firestore";

const initialState: InitialState = {
  accounts: [],
  isLoading: false,
  error: ""
};

// query / thunk
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async () => {
    try {
      const accounts: Account[] = [];
      const querySnapshot = await getDocs(collection(firestoreDb, "accounts"));

      querySnapshot.forEach((doc) => {
        accounts.push({
          id: doc.id,
          userid: doc.data().userid,
          dateCreated: String(new Date(doc.data().dateCreated.seconds * 1000)),
          name: doc.data().name,
          amount: doc.data().amount,
        });
      });

      return accounts;
    } catch (err) {
      console.error(err);
      throw err;
      // TODO: Probably add error to state?
    }
  },
);

// accounts slice
const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<Account[]>) => {
         state.accounts = action.payload;
      },
    );
  },
});


export default accountsSlice.reducer;