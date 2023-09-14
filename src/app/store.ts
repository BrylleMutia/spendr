import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import accountsReducer from "../features/accounts/accountsSlice";
import entriesReducer from "../features/entries/entriesSlice";
import categoriesReducer from "../features/categories/categoriesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    accounts: accountsReducer,
    entries: entriesReducer,
    categories: categoriesReducer,
  },
});

// types for selector and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
