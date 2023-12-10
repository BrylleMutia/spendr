import { ErrorResponse } from "../users/userTypes";

export type InitialState = {
  accounts: Account[];
  isLoading: boolean;
  error: ErrorResponse;
};

export type NewAccount = {
  userId: string;
  name: string;
  amount: number;
};

export type Account = NewAccount & {
  id: string;
  dateCreated: string;
};
