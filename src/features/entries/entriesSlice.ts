import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { Entry, EntryInput, InitialState } from "./entryTypes";
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
} from "firebase/firestore";
import { firestoreDb } from "../../api/fireStore";
import dateConverter, {
  currentDateMonthYear,
  dateConvertMonthYear,
} from "../../utils/dateConverter";
import moment from "moment";

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
      return getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          console.log("Add entry triggered!", doc.data());

          return {
            id: doc.id,
            categoryId: doc.data().categoryId,
            dateCreated: dateConverter(doc.data().dateCreated.seconds),
            accountId: doc.data().accountId,
            note: doc.data().note,
            amount: doc.data().amount,
            purpose: doc.data().purpose,
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
    const entriesRef = collection(firestoreDb, "entries");
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
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAllEntries.fulfilled,
      (state, action: PayloadAction<Entry[]>) => {
        state.entries = action.payload;

        // calculate for current month totals (expense, income, and cashflow)
        state.totals.current.expense = action.payload.reduce((sum, current) => {
          if (
            dateConvertMonthYear(current.dateCreated) === currentDateMonthYear()
          ) {
            if (current.purpose === "expense") {
              return sum - current.amount;
            } else {
              return sum;
            }
          } else return sum;
        }, 0);

        state.totals.current.income = action.payload.reduce((sum, current) => {
          if (
            dateConvertMonthYear(current.dateCreated) === currentDateMonthYear()
          ) {
            if (current.purpose === "income") {
              return sum + current.amount;
            } else {
              return sum;
            }
          } else return sum;
        }, 0);

        state.totals.current.cashflow = action.payload.reduce(
          (sum, current) => {
            if (
              dateConvertMonthYear(current.dateCreated) ===
              currentDateMonthYear()
            ) {
              if (current.purpose === "expense") {
                return sum - current.amount;
              } else if (current.purpose === "income") {
                return sum + current.amount;
              } else {
                return sum;
              }
            } else return sum;
          },
          0,
        );

        // previous month totals
        state.totals.prev.expense = action.payload.reduce((sum, current) => {
          if (
            dateConvertMonthYear(current.dateCreated) ===
            currentDateMonthYear(1)
          ) {
            if (current.purpose === "expense") {
              return sum - current.amount;
            } else {
              return sum;
            }
          } else return sum;
        }, 0);

        state.totals.prev.income = action.payload.reduce((sum, current) => {
          if (
            dateConvertMonthYear(current.dateCreated) ===
            currentDateMonthYear(1)
          ) {
            if (current.purpose === "income") {
              return sum + current.amount;
            } else {
              return sum;
            }
          } else return sum;
        }, 0);

        state.totals.prev.cashflow = action.payload.reduce((sum, current) => {
          if (
            dateConvertMonthYear(current.dateCreated) ===
            currentDateMonthYear(1)
          ) {
            if (current.purpose === "expense") {
              return sum - current.amount;
            } else if (current.purpose === "income") {
              return sum + current.amount;
            } else {
              return sum;
            }
          } else return sum;
        }, 0);

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
          state.isLoading = false;
          state.error = { message: "" };
        }
      },
    );
    builder.addMatcher(isAnyOf(getAllEntries.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(
      isAnyOf(getAllEntries.rejected),
      (state, action: PayloadAction<ErrorResponse>) => {
        state.error = action.payload;
        state.isLoading = false;
      },
    );
  },
});

export const { updateMonthInView } = entriesSlice.actions;
export default entriesSlice.reducer;
