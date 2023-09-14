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

const initialState: InitialState = {
  entries: [],
  isLoading: false,
  error: {
    message: "",
  },
};

// thunk
export const addEntry = createAsyncThunk<Entry | undefined, EntryInput, { rejectValue: ErrorResponse }>(
  "entries/addEntry",
  async (entryData, thunkAPI) => {
    try {
      // add document
      const entriesRef = collection(firestoreDb, "entries");
      const querySnapshot = await addDoc(entriesRef, { dateCreated: Timestamp.fromDate(new Date()), ...entryData });

      if (querySnapshot.id) {
        // get document details
        const docRef = doc(firestoreDb, "entries", querySnapshot.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            categoryId: docSnap.data().categoryId,
            dateCreated: docSnap.data().dateCreated,
            accountId: docSnap.data().accountId,
            note: docSnap.data().note,
            amount: docSnap.data().amount,
          };
        }
      }
    } catch (err) {
      if (!err) {
        throw err;
      }

      return thunkAPI.rejectWithValue({ message: err as string });
    }
  },
);

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
        dateCreated: doc.data().dateCreated,
        accountId: doc.data().accountid,
        categoryId: doc.data().categoryid,
        note: doc.data().note,
        amount: doc.data().amount,
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
