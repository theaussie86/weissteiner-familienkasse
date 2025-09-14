"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/libs/supabase/client";
import { Transaction } from "@/types";

const supabase = createClient();

export function useTransactionsQuery() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familienkasse_transactions")
        .select("*")
        .order("created", { ascending: false })
        .order("id", { ascending: false }) // Stabile Sortierung: erst created, dann id
        .limit(10);
      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}

export function useTransactionsPaginationQuery(
  page: number = 1,
  pageSize: number = 10
) {
  const offset = (page - 1) * pageSize;

  return useQuery<{
    data: Transaction[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>({
    queryKey: ["transactions", "pagination", page, pageSize],
    queryFn: async () => {
      // Zuerst die Gesamtanzahl abrufen
      const { count, error: countError } = await supabase
        .from("familienkasse_transactions")
        .select("*", { count: "exact", head: true });

      if (countError) throw new Error(countError.message);

      // Dann die paginierten Daten abrufen
      const { data, error } = await supabase
        .from("familienkasse_transactions")
        .select("*")
        .order("created", { ascending: false })
        .order("id", { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) throw new Error(error.message);

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: data || [],
        total,
        page,
        pageSize,
        totalPages,
      };
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Transaction>;
    }) => {
      const { error } = await supabase
        .from("familienkasse_transactions")
        .update(data)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["account_summaries"] });
    },
    onError: (error) => {
      console.error("Failed to update transaction:", error);
    },
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Transaction>) => {
      const { error } = await supabase
        .from("familienkasse_transactions")
        .insert(data);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["account_summaries"] });
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("familienkasse_transactions")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["account_summaries"] });
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error);
    },
  });
}
