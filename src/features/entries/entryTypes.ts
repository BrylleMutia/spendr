import { ErrorResponse } from "../users/userTypes";

export type InitialState = {
   entries: Entry[],
   isLoading: boolean;
   error: ErrorResponse
   totals: {
      expense: number;
      income: number;
      cashflow: number;
   }
}

export type Entry = EntryInput & {
   id: string;
   dateCreated: string;
}

type Purpose = "income" | "expense"

export type EntryInput = {
   categoryId: string
   accountId: string;
   note?: string;
   amount: number;
   purpose: Purpose;
}