export * from "./config";

export type Transaction = {
  id: string;
  created: string;
  description: string | null;
  amount: number | null;
  account: string | null;
  is_paid: boolean | null;
  currency: string | null;
};
