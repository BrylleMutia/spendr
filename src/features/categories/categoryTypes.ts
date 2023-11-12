import { ErrorResponse } from "../users/userTypes";

export type InitialState = {
   categories: Category[],
   isLoading: boolean;
   error: ErrorResponse
}

export type CategoryInput = {
   name: string;
   userId: string;
   iconUrl?: string;
}

export type Category = CategoryInput & {
   id: string;
   dateCreated: string;
   userId?: string;
}