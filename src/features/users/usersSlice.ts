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
    email: "",
    emailVerified: false,
    photoURL: "",
    accessToken: ""
  },
  isLoading: false,
  error: {
    message: "",
  },
};

// query / thunk
// export const getAllUsers = createAsyncThunk<
//   User[], // output type
//   number, // input type
//   { rejectValue: ErrorResponse } // error type
// >("users/getAllUsers", async (limitNum, thunkAPI) => {
//   try {
//     const users: User[] = [];
//     const usersRef = collection(firestoreDb, "users");

//     let querySnapshot;
//     if (limitNum) {
//       querySnapshot = await getDocs(query(usersRef, limit(limitNum)));
//     } else querySnapshot = await getDocs(query(usersRef));

//     querySnapshot.forEach((doc) => {
//       users.push({
//         id: doc.id,
//         name: doc.data().name,
//         dateCreated: dateConverter(doc.data().dateCreated.seconds), // convert timestamp from firebase to date
//       });
//     });

//     return users;
//   } catch (err) {
//     if (!err) {
//       throw err;
//     }

//     return thunkAPI.rejectWithValue({ message: err as string });
//   }
// });

// export const getUserById = createAsyncThunk<
//   User, // output type
//   string, // input type
//   { rejectValue: ErrorResponse } // error type
// >("users/getUserById", async (userId, thunkAPI) => {
//   try {
//     let user: User = { dateCreated: "", id: "", name: "" };

//     const userRef = doc(firestoreDb, "users", userId);

//     if (userId) {
//       await getDoc(userRef).then((doc) => {
//         if (doc.exists()) {
//           user = {
//             id: doc.id,
//             name: doc.data().name,
//             dateCreated: dateConverter(doc.data().dateCreated.seconds),
//           };
//         }
//       });
//     }

//     return user;
//   } catch (err) {
//     if (!err) {
//       throw err;
//     }

//     return thunkAPI.rejectWithValue({ message: err as string });
//   }
// });


// users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    // builder.addCase(
    //   getAllUsers.fulfilled,
    //   (state, action: PayloadAction<User[]>) => {
    //     state.users = action.payload;
    //     state.isLoading = false;
    //     state.error = { message: "" };
    //   },
    // );

    // builder.addCase(
    //   getUserById.fulfilled,
    //   (state, action: PayloadAction<User>) => {
    //     state.user = action.payload;
    //     state.isLoading = false;
    //     state.error = { message: "" };
    //   },
    // ),
    //   builder.addMatcher(
    //     isAnyOf(getAllUsers.pending, getUserById.pending),
    //     (state) => {
    //       state.isLoading = true;
    //     },
    //   ),
    //   builder.addMatcher(
    //     isAnyOf(
    //       getAllUsers.rejected,
    //       getUserById.rejected,
    //     ),
    //     (state, action: PayloadAction<ErrorResponse>) => {
    //       state.error = action.payload;
    //       state.isLoading = false;
    //     },
    //   );
  },
});

export const { saveUser } = usersSlice.actions;
export default usersSlice.reducer;
