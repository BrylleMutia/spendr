import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import type {
  InitialState,
  User,
  ErrorResponse,
  authDetails,
} from "./userTypes";
import { firestoreDb, firebaseAuth } from "../../api/fireStore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  where,
  limit,
  query,
} from "firebase/firestore";
import dateConverter from "../../utils/dateConverter";

const initialState: InitialState = {
  user: {
    dateCreated: "",
    id: "",
    name: "",
  },
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
        dateCreated: dateConverter(doc.data().dateCreated.seconds), // convert timestamp from firebase to date
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

export const getUserById = createAsyncThunk<
  User, // output type
  string, // input type
  { rejectValue: ErrorResponse } // error type
>("users/getUserById", async (userId, thunkAPI) => {
  try {
    let user: User = { dateCreated: "", id: "", name: "" };

    const userRef = doc(firestoreDb, "users", userId);

    if (userId) {
      await getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          user = {
            id: doc.id,
            name: doc.data().name,
            dateCreated: dateConverter(doc.data().dateCreated.seconds),
          };
        }
      });
    }

    return user;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

export const loginUser = createAsyncThunk<
  User | undefined, // output type
  authDetails, // input type
  { rejectValue: ErrorResponse } // error type
>("users/loginUser", async (authDetails, thunkAPI) => {
  try {
    const { email, password } = authDetails;

    createUserWithEmailAndPassword(firebaseAuth, email, password).then(
      (userCredential) => {
        // Signed up
        const user = userCredential.user;
        return user;
      },
    );
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});


// TODO: configure auth
export const registerUser = createAsyncThunk<
  User, // output type
  authDetails, // input type
  { rejectValue: ErrorResponse } // error type
>("users/registerUser", async (authDetails, thunkAPI) => {
  try {
    const { email, password } = authDetails;
    let user = { dateCreated: "", id: "", name: "" };

    await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
      (userCredential) => {
        // Signed up
        console.log(userCredential);
      },
    );

    return user;
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
    // builder.addCase(
    //   getAllUsers.fulfilled,
    //   (state, action: PayloadAction<User[]>) => {
    //     state.users = action.payload;
    //     state.isLoading = false;
    //     state.error = { message: "" };
    //   },
    // );

    builder.addCase(
      getUserById.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = { message: "" };
      },
    ),
      builder.addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isLoading = false;
          state.error = { message: "" };
        },
      ),
      builder.addMatcher(
        isAnyOf(getAllUsers.pending, getUserById.pending),
        (state) => {
          state.isLoading = true;
        },
      ),
      builder.addMatcher(
        isAnyOf(getAllUsers.rejected, getUserById.rejected),
        (state, action: PayloadAction<ErrorResponse>) => {
          state.error = action.payload;
          state.isLoading = false;
        },
      );
  },
});

export default usersSlice.reducer;
