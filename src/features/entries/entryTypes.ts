import { ErrorResponse } from "../users/userTypes";

export type InitialState = {
   entries: Entry[],
   isLoading: boolean;
   error: ErrorResponse
}

export type Entry = {
   id: string;
   categoryId: string;
   dateCreated: string;
   accountId: string;
   note: string;
   amount: number;
}