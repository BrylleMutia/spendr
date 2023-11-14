import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { Category, CategoryInput, InitialState } from "./categoryTypes";
import { ErrorResponse } from "../users/userTypes";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getDoc,
  limit,
  query,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../api/fireStore";
import dateConverter from "../../utils/dateConverter";

const initialState: InitialState = {
  categories: [],
  isLoading: false,
  error: {
    message: "",
  },
};

// Add new category action
export const addNewCategory = createAsyncThunk<
  Category | undefined,
  CategoryInput,
  { rejectValue: ErrorResponse }
>("categories/addNewCategory", async (newCategory, thunkAPI) => {
  try {
    const categoriesRef = collection(firestoreDb, "categories");
    const newCategoryWithTimestamp = {
      ...newCategory,
      dateCreated: Timestamp.fromDate(new Date()),
    };

    await addDoc(categoriesRef, newCategoryWithTimestamp).then((docRef) => {
      // get newly added category
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          return {
            id: doc.id,
            name: doc.data().name,
            userId: doc.data().userid,
            dateCreated: dateConverter(doc.data().dateCreated.seconds), // convert timestamp from firebase to date
          };
        }
      });
    });
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

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
      if (doc.exists()) {
        categories.push({
          id: doc.id,
          name: doc.data().name,
          userId: doc.data().userId,
          dateCreated: dateConverter(doc.data().dateCreated.seconds), // convert timestamp from firebase to date
        });
      }
    });

    return categories;
  } catch (err) {
    if (!err) {
      throw err;
    }

    return thunkAPI.rejectWithValue({ message: err as string });
  }
});

export const getAllCategoriesByUserId = createAsyncThunk<
  Category[],
  string,
  { rejectValue: ErrorResponse }
>("categories/getAllCategoriesByUserId", async (userId, thunkAPI) => {
  try {
    const categories: Category[] = [];
    const categoriesRef = collection(firestoreDb, "categories");

    await getDocs(query(categoriesRef, where("userId", "==", userId))).then(
      (docs) => {
        docs.forEach((doc) => {
          categories.push({
            id: doc.id,
            name: doc.data().name,
            userId: doc.data().userId,
            dateCreated: dateConverter(doc.data().dateCreated.seconds),
          });
        });
      },
    );

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
    builder.addCase(
      getAllCategoriesByUserId.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
        state.isLoading = false;
        state.error = { message: "" };
      },
    );
    builder.addCase(
      addNewCategory.fulfilled,
      (state, action: PayloadAction<Category | undefined>) => {
        if (action.payload) {
          state.categories = [action.payload, ...state.categories];
        }

        state.isLoading = false;
        state.error = { message: "" };
      },
    );
    builder.addMatcher(
      isAnyOf(
        getAllCategories.pending,
        getAllCategoriesByUserId.pending,
        addNewCategory.pending,
      ),
      (state) => {
        state.isLoading = true;
      },
    );
    builder.addMatcher(
      isAnyOf(
        getAllCategories.rejected,
        getAllCategoriesByUserId.rejected,
        addNewCategory.rejected,
      ),
      (state, action: PayloadAction<ErrorResponse>) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );
  },
});

export default categoriesSlice.reducer;
