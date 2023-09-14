import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { InitialState, User, ErrorResponse } from "./userTypes";
import { firestoreDb } from "../../api/fireStore";
import { collection, getDocs, limit, query } from "firebase/firestore";

const initialState: InitialState = {
  users: [],
  isLoading: false,
  error: {
    message: "",
  },
};

// query / thunk
export const getAllUsers = createAsyncThunk<
  User[], // output type
  number, // input type
  { rejectValue: ErrorResponse } // error type
>("users/getAllUsers", async (limitNum, thunkAPI) => {
  try {
    const users: User[] = [];
    const usersRef = collection(firestoreDb, "users");

    let querySnapshot;
    if (limitNum) {
      querySnapshot = await getDocs(query(usersRef, limit(limitNum)));
    } else querySnapshot = await getDocs(query(usersRef));

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        name: doc.data().name,
        dateCreated: String(new Date(doc.data().dateCreated.seconds * 1000)), // convert timestamp from firebase to date
      });
    });

    return users;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

// users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAllUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.isLoading = false;
        state.error = { message: "" };
      },
    );
    builder.addMatcher(isAnyOf(getAllUsers.pending), (state) => {
      state.isLoading = true;
    }),
      builder.addMatcher(
        isAnyOf(getAllUsers.rejected),
        (state, action: PayloadAction<ErrorResponse>) => {
          state.error = action.payload;
          state.isLoading = false;
        },
      );
  },
});

export default usersSlice.reducer;
