import { ErrorResponse } from "../users/userTypes";

export type InitialState = {
  entries: Entry[];
  isLoading: boolean;
  error: ErrorResponse;
  totals: {
    prev: Totals;
    current: Totals;
  };
  monthInView: string;
};

export type Totals = {
  expense: number;
  income: number;
  cashflow: number;
};

export type Entry = EntryInput & {
  id: string;
  dateCreated: string;
};

export type Purpose = "income" | "expense" | "transfer";

export type EntryInput = {
  categoryId: string;
  accountId: string;
  note?: string;
  amount: number;
  purpose: Purpose;
};
