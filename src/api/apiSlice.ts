import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(), // fakeBaseQuery because we're using firebase for query
  tagTypes: ["Entry", "User", "Account"],
  endpoints: (builder) => ({}),
});
