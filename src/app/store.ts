import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import accountsReducer from "../features/accounts/accountsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    accounts: accountsReducer
  },
});

// types for selector and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;