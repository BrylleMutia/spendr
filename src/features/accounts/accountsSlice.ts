import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { InitialState, Account } from "./accountTypes";
import { firestoreDb } from "../../api/fireStore";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { ErrorResponse } from "../users/userTypes";

const initialState: InitialState = {
  accounts: [],
  isLoading: false,
  error: {
    message: "",
  },
};

// query / thunk
export const getAllAccounts = createAsyncThunk<
  Account[],
  number,
  { rejectValue: ErrorResponse }
>("accounts/getAllAccounts", async (limitNum, thunkAPI) => {
  try {
    const accounts: Account[] = [];
    const accountsRef = collection(firestoreDb, "accounts");

    let querySnapshot = await getDocs(query(accountsRef));
    if (limitNum) {
      querySnapshot = await getDocs(query(accountsRef, limit(limitNum)));
    }

    querySnapshot.forEach((doc) => {
      accounts.push({
        id: doc.id,
        userId: doc.data().userid,
        dateCreated: String(new Date(doc.data().dateCreated.seconds * 1000)),
        name: doc.data().name,
        amount: doc.data().amount,
      });
    });

    return accounts;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

// accounts slice
const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAllAccounts.fulfilled,
      (state, action: PayloadAction<Account[]>) => {
        state.accounts = action.payload;
        state.isLoading = false;
        state.error = { message: "" };
      },
    ),
      builder.addMatcher(isAnyOf(getAllAccounts.pending), (state) => {
        state.isLoading = true;
      }),
      builder.addMatcher(
        isAnyOf(getAllAccounts.rejected),
        (state, action: PayloadAction<ErrorResponse>) => {
          state.error = action.payload;
          state.isLoading = false;
        },
      );
  },
});

export default accountsSlice.reducer;
