"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/libs/supabase/client";
import { Account, AccountSummary } from "@/types";

const supabase = createClient();

export function useAccountQuery(accountId: string | null) {
  return useQuery<Account | null>({
    queryKey: ["account", accountId],
    queryFn: async () => {
      if (!accountId) return null;
      const { data, error } = await supabase
        .from("familienkasse_accounts")
        .select("id, name")
        .eq("id", accountId)
        .single();
      if (error) {
        console.error("Error fetching account:", error);
        return null;
      }
      return data;
    },
    enabled: !!accountId,
  });
}

export function useAccountsQuery(enabled: boolean = true) {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familienkasse_accounts")
        .select("id, name");
      if (error) {
        console.error("Error fetching accounts:", error);
        return [];
      }
      return data || [];
    },
    enabled,
  });
}

export function useAccountSummariesQuery() {
  return useQuery<AccountSummary[]>({
    queryKey: ["account_summaries"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_account_summaries");
      if (error) {
        console.error("Error fetching account summaries:", error);
        return [];
      }
      return data || [];
    },
  });
}
