export * from "./config";

export type Transaction = {
  id: string;
  created: string;
  description: string | null;
  amount: number | null;
  account_id: string | null;
  is_paid: boolean | null;
};

export type Account = {
  id: string;
  name: string;
};

export type AccountSummary = {
  id: string;
  name: string;
  ist_balance: number;
  soll_balance: number;
};
