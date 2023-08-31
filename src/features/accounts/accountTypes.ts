export type InitialState = {
  accounts: Account[];
  isLoading: boolean;
  error: string;
};

export type Account = {
  id: string;
  dateCreated: string;
  userid: string;
  name: string;
  amount: number;
};
