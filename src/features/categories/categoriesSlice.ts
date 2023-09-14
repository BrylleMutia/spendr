import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { Category, InitialState } from "./categoryTypes";
import { ErrorResponse } from "../users/userTypes";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { firestoreDb } from "../../api/fireStore";

const initialState: InitialState = {
  categories: [],
  isLoading: false,
  error: {
    message: "",
  },
};

export const getAllCategories = createAsyncThunk<
  Category[],
  number,
  { rejectValue: ErrorResponse }
>("categories/getAllCategories", async (limitNum, thunkAPI) => {
  try {
    const categories: Category[] = [];
    const categoriesRef = collection(firestoreDb, "categories");

    let querySnapshot;
    if (limitNum) {
      querySnapshot = await getDocs(query(categoriesRef, limit(limitNum)));
    } else querySnapshot = await getDocs(query(categoriesRef));

    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        name: doc.data().name,
        userId: doc.data().userId,
        dateCreated: String(new Date(doc.data().dateCreated.seconds * 1000)), // convert timestamp from firebase to date
      });
    });

    return categories;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAllCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
        state.isLoading = false;
        state.error = { message: "" };
      },
    );
    builder.addMatcher(isAnyOf(getAllCategories.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(
      isAnyOf(getAllCategories.rejected),
      (state, action: PayloadAction<ErrorResponse>) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );
  },
});


export default categoriesSlice.reducer;