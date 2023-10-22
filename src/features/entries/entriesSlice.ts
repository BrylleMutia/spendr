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
import dateConverter from "../../utils/dateConverter";

const initialState: InitialState = {
  entries: [],
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
        accountId: doc.data().accountid,
        categoryId: doc.data().categoryid,
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAllEntries.fulfilled,
      (state, action: PayloadAction<Entry[]>) => {
        state.entries = action.payload;
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

export default entriesSlice.reducer;
