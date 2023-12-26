import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { Entry, EntryInput, EntryResponse, InitialState } from "./entryTypes";
import { ErrorResponse } from "../users/userTypes";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  limit,
  query,
  where,
  documentId,
  updateDoc,
} from "firebase/firestore";
import { firestoreDb } from "../../api/fireStore";
import moment from "moment";
import {
  aggregateAmountByPurpose,
  getTotals,
} from "../../utils/amountCalculators";
import dateConverter from "../../utils/dateConverter";

const initialState: InitialState = {
  entries: [],
  totals: {
    prev: {
      expense: 0,
      income: 0,
      cashflow: 0,
    },
    current: {
      expense: 0,
      income: 0,
      cashflow: 0,
    },
  },
  monthInView: "",
  isLoading: false,
  error: {
    message: "",
  },
};

// Firestore DB ref
const entriesRef = collection(firestoreDb, "entries");

// thunk
export const addEntry = createAsyncThunk<
  Entry | undefined,
  EntryInput,
  { rejectValue: ErrorResponse }
>("entries/addEntry", async (entryData, thunkAPI) => {
  try {
    // add document
    const entriesRef = collection(firestoreDb, "entries");

    const newAddedEntry = await addDoc(entriesRef, {
      dateCreated: Timestamp.fromDate(new Date()),
      ...entryData,
    }).then((docRef) => {
      return getDoc(docRef).then((entryDocData) => {
        if (entryDocData.exists()) {
          console.log("Add entry triggered!", entryDocData.data());
          const { accountId, amount, categoryId, dateCreated, purpose, note } =
            entryDocData.data() as EntryResponse;

          // update account amount
          const accountsRef = doc(firestoreDb, "accounts", accountId);

          getDoc(accountsRef).then(async (accountDocData) => {
            if (accountDocData.exists()) {
              await updateDoc(accountsRef, {
                amount:
                  accountDocData.data().amount +
                  aggregateAmountByPurpose(purpose, amount),
              });
            }
          });

          return {
            id: entryDocData.id,
            categoryId,
            dateCreated: dateConverter(dateCreated.seconds),
            accountId,
            note,
            amount,
            purpose,
          };
        }
      });
    });

    return newAddedEntry;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

export const getAllEntries = createAsyncThunk<
  Entry[],
  number,
  { rejectValue: ErrorResponse }
>("entries/getAllEntries", async (limitNum, thunkAPI) => {
  try {
    const entries: Entry[] = [];
    let querySnapshot = await getDocs(query(entriesRef));
    if (limitNum) {
      querySnapshot = await getDocs(query(entriesRef, limit(limitNum)));
    }

    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        dateCreated: dateConverter(doc.data().dateCreated.seconds),
        accountId: doc.data().accountId,
        categoryId: doc.data().categoryId,
        note: doc.data().note,
        amount: doc.data().amount,
        purpose: doc.data().purpose,
      });
    });

    return entries;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

export const getAllEntriesByAccountIds = createAsyncThunk<
  Entry[],
  string[],
  { rejectValue: ErrorResponse }
>("entries/getAllEntriesByAccountIds", async (accountIds, thunkAPI) => {
  try {
    const entries: Entry[] = [];
    await getDocs(query(entriesRef, where("accountId", "in", accountIds))).then(
      (docs) => {
        docs.forEach((doc) => {
          entries.push({
            id: doc.id,
            dateCreated: dateConverter(doc.data().dateCreated.seconds),
            accountId: doc.data().accountId,
            categoryId: doc.data().categoryId,
            note: doc.data().note,
            amount: doc.data().amount,
            purpose: doc.data().purpose,
          });
        });
      },
    );

    return entries;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

// slice
const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    updateMonthInView: (state, action: PayloadAction<number>) => {
      state.monthInView = moment(state.monthInView, "MMMM YYYY")
        .add(action.payload, "M")
        .format("MMMM YYYY");
    },
    clearEntries: (state) => {
      state.entries = [];
      state.totals = {
        prev: {
          expense: 0,
          income: 0,
          cashflow: 0,
        },
        current: {
          expense: 0,
          income: 0,
          cashflow: 0,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAllEntriesByAccountIds.fulfilled,
      (state, action: PayloadAction<Entry[]>) => {
        state.entries = action.payload;

        // calculate for current month totals (expense, income, and cashflow)
        state.totals.current.expense = getTotals(action.payload, "expense");
        state.totals.current.income = getTotals(action.payload, "income");
        state.totals.current.cashflow = getTotals(action.payload, "cashflow");

        // previous month totals
        state.totals.prev.expense = getTotals(action.payload, "expense", 1);
        state.totals.prev.income = getTotals(action.payload, "income", 1);
        state.totals.prev.cashflow = getTotals(action.payload, "cashflow", 1);

        // get latest month to display in mmmm yyyy format
        state.monthInView = moment(
          action.payload.sort((a, b) =>
            a.dateCreated > b.dateCreated ? -1 : 1,
          )[0].dateCreated,
        ).format("MMMM YYYY");

        state.isLoading = false;
        state.error = { message: "" };
      },
    );
    builder.addCase(
      addEntry.fulfilled,
      (state, action: PayloadAction<Entry | undefined>) => {
        if (action.payload) {
          state.entries = [action.payload, ...state.entries];

          // calculate for current month totals (expense, income, and cashflow)
          state.totals.current.expense = getTotals(state.entries, "expense");
          state.totals.current.income = getTotals(state.entries, "income");
          state.totals.current.cashflow = getTotals(state.entries, "cashflow");

          // previous month totals
          state.totals.prev.expense = getTotals(state.entries, "expense", 1);
          state.totals.prev.income = getTotals(state.entries, "income", 1);
          state.totals.prev.cashflow = getTotals(state.entries, "cashflow", 1);

          state.isLoading = false;
          state.error = { message: "" };
        }
      },
    );
    builder.addMatcher(
      isAnyOf(getAllEntriesByAccountIds.pending, addEntry.pending),
      (state) => {
        state.isLoading = true;
      },
    );
    builder.addMatcher(
      isAnyOf(getAllEntriesByAccountIds.rejected, addEntry.rejected),
      (state, action: PayloadAction<ErrorResponse>) => {
        state.error = action.payload;
        state.isLoading = false;
      },
    );
  },
});

export const { updateMonthInView, clearEntries } = entriesSlice.actions;
export default entriesSlice.reducer;
