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
