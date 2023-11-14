export type InitialState = {
  user: User;
  isLoading: boolean;
  error: ErrorResponse;
};

export type ErrorResponse = {
  message: string;
} | undefined;

export type User = {
  id: string;
  dateCreated: string;
  name: string;
};
