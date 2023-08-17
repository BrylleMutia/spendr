import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  // getDefaultMiddleware gets the automatically added middleware on store (thunk, logger)
    getDefaultMiddleware().concat(apiSlice.middleware),
});
