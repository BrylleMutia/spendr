import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { InitialState, Account, NewAccount } from "./accountTypes";
import { firestoreDb } from "../../api/fireStore";
import {
  collection,
  getDocs,
  query,
  limit,
  where,
  addDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { ErrorResponse } from "../users/userTypes";
import dateConverter from "../../utils/dateConverter";
import { getAllEntriesByAccountIds } from "../entries/entriesSlice";

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
        userId: doc.data().userId,
        dateCreated: dateConverter(doc.data().dateCreated.seconds),
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

export const getAllAccountsByUserId = createAsyncThunk<
  Account[],
  string,
  { rejectValue: ErrorResponse }
>("accounts/getAllAccountsByUserId", async (userId, thunkAPI) => {
  try {
    const accounts: Account[] = [];
    const accountsRef = collection(firestoreDb, "accounts");

    await getDocs(query(accountsRef, where("userId", "==", userId))).then(
      (docs) => {
        docs.forEach((doc) => {
          accounts.push({
            id: doc.id,
            userId: doc.data().userId,
            dateCreated: dateConverter(doc.data().dateCreated.seconds),
            name: doc.data().name,
            amount: doc.data().amount,
          });
        });
      },
    );

    return accounts;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

export const addNewAccount = createAsyncThunk<
  Account | undefined,
  NewAccount,
  { rejectValue: ErrorResponse }
>("accounts/addNewAccount", async (accountDetails, thunkAPI) => {
  try {
    const accountsRef = collection(firestoreDb, "accounts");

    const newAccount = await addDoc(accountsRef, {
      dateCreated: Timestamp.fromDate(new Date()),
      ...accountDetails,
    }).then((docRef) => {
      return getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          console.log("Added new account!", doc.data());

          return {
            id: doc.id,
            dateCreated: dateConverter(doc.data().dateCreated.seconds),
            userId: doc.data().userId,
            name: doc.data().name,
            amount: doc.data().amount,
          };
        }
      });
    });

    return newAccount;
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
      addNewAccount.fulfilled,
      (state, action: PayloadAction<Account | undefined>) => {
        if (action.payload) {
          state.accounts = [...state.accounts, action.payload];
          state.isLoading = false;
          state.error = { message: "" };
        }
      },
    ),
      builder.addCase(
        getAllAccounts.fulfilled,
        (state, action: PayloadAction<Account[]>) => {
          state.accounts = action.payload;
          state.isLoading = false;
          state.error = { message: "" };
        },
      ),
      builder.addCase(
        getAllAccountsByUserId.fulfilled,
        (state, action: PayloadAction<Account[]>) => {
          state.accounts = action.payload;
          state.isLoading = false;
          state.error = { message: "" };
        },
      ),
      builder.addMatcher(
        isAnyOf(
          getAllAccounts.pending,
          getAllAccountsByUserId.pending,
          addNewAccount.pending,
        ),
        (state) => {
          state.isLoading = true;
        },
      ),
      builder.addMatcher(
        isAnyOf(
          getAllAccounts.rejected,
          getAllAccountsByUserId.rejected,
          addNewAccount.rejected,
        ),
        (state, action: PayloadAction<ErrorResponse>) => {
          state.error = action.payload;
          state.isLoading = false;
        },
      );
  },
});

export default accountsSlice.reducer;
