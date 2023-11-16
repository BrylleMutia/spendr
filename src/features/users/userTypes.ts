export type InitialState = {
  user: User;
  isLoading: boolean;
  error: ErrorResponse;
};

export type ErrorResponse =
  | {
      message: string;
    }
  | undefined;

export type User = {
  id: string;
  dateCreated?: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  emailVerified: boolean;
  accessToken: string;
};

export type authDetails = {
  email: string;
  password: string;
};
