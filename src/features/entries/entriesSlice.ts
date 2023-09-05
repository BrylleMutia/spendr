import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { Entry, InitialState } from "./entryTypes";
import { ErrorResponse } from "../users/userTypes";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { firestoreDb } from "../../api/fireStore";

const initialState: InitialState = {
  entries: [],
  isLoading: false,
  error: {
    message: "",
  },
};

// thunk
// TODO: ADD ENTRIES USING ADDDOC! (not manual)


const fetchEntries = createAsyncThunk<
  Entry[],
  number,
  { rejectValue: ErrorResponse }
>("entries/fetchEntries", async (limitNum, thunkAPI) => {
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
      fetchEntries.fulfilled,
      (state, action: PayloadAction<Entry[]>) => {
        state.entries = action.payload;
        state.isLoading = false;
        state.error = { message: "" };
      },
    );
    builder.addMatcher(isAnyOf(fetchEntries.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(
      isAnyOf(fetchEntries.rejected),
      (state, action: PayloadAction<ErrorResponse>) => {
        state.error = action.payload;
        state.isLoading = false;
      },
    );
  },
});

export default entriesSlice.reducer;
