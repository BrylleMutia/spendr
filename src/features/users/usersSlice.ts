import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "./userTypes";
import { firestoreDb } from "../../api/fireStore";
import { collection, getDocs } from "firebase/firestore";

type InitialState = {
  users: User[];
};

const initialState: InitialState = {
  users: [],
};

// query / thunk
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const users: User[] = [];
    const querySnapshot = await getDocs(collection(firestoreDb, "users"));

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        name: doc.data().name,
        dateCreated: String(new Date(doc.data().dateCreated.seconds * 1000)),
      } as User);
    });

    return users;
  } catch (err) {
    console.error(err);
    throw err;
  }
});

// users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
      },
    );
  },
});

export default usersSlice.reducer;
