import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { InitialState, User, ErrorResponse } from "./userTypes";
import { firestoreDb } from "../../api/fireStore";
import { collection, getDocs } from "firebase/firestore";

const initialState: InitialState = {
  users: [],
  isLoading: false,
  error: {
    message: ""
  }
};

// query / thunk
export const fetchUsers = createAsyncThunk<User[], string, { rejectValue: ErrorResponse }>("users/fetchUsers", async (_, thunkAPI) => {
  try {
    const users: User[] = [];
    const querySnapshot = await getDocs(collection(firestoreDb, "users"));

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        name: doc.data().name,
        dateCreated: String(new Date(doc.data().dateCreated.seconds * 1000)), // convert timestamp from firebase to date
      });
    });

    return users;
  } catch (err) {
    // console.error(err);
    thunkAPI.rejectWithValue({ message: err })
    // throw err;
  }
});

// users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
    }),
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
      },
    );
    builder.addMatcher(isAnyOf(fetchUsers.rejected), (state, action: PayloadAction<ErrorResponse>) => {
      state.error = action.payload;
      state.isLoading = false;
    })
  },
});

export default usersSlice.reducer;
