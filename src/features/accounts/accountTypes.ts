import { ErrorResponse } from "../users/userTypes";

export type InitialState = {
  accounts: Account[];
  isLoading: boolean;
  error: ErrorResponse;
};

export type Account = {
  id: string;
  dateCreated: string;
  userId: string;
  name: string;
  amount: number;
};
