"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { Loader2, Trash2 } from "lucide-react";
import { columns } from "./columns";
import {
  useTransactionsQuery,
  useDeleteTransactionMutation,
} from "@/hooks/queries/transactions";
import { useAccountsQuery } from "@/hooks/queries/accounts";
import { Button } from "../ui/button";

export default function TransactionsList() {
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: errorTransactions,
  } = useTransactionsQuery();

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: errorAccounts,
  } = useAccountsQuery();

  const { mutate: deleteTransaction } = useDeleteTransactionMutation();

  const accountsMap = useMemo(() => {
    if (!accounts) return new Map();
    return new Map(accounts.map((account) => [account.id, account.name]));
  }, [accounts]);

  const table = useReactTable({
    data: transactions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      accounts,
      accountsMap,
    },
  });

  if (isLoadingTransactions || isLoadingAccounts) {
    return <p>Lade Daten...</p>;
  }

  if (errorTransactions || errorAccounts) {
    return <p>Fehler beim Laden der Daten.</p>;
  }

  if (!transactions || transactions.length === 0) {
    return <p>Keine Transaktionen gefunden.</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Letzte Transaktionen</h1>
        <Button>Neue Transaktion</Button>
      </div>
      {/* Desktop View: Table */}
      <div className="hidden md:block border border-gray-300 rounded-lg overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr
              key={table.getHeaderGroups()[0].id}
              className="bg-gray-100 border-b border-gray-300"
            >
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left p-2 text-sm font-medium text-gray-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2 px-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="p-4 space-y-2 border rounded-lg shadow bg-base-100"
            >
              {row.getVisibleCells().map((cell) => {
                const headerContext =
                  cell.column.columnDef.header &&
                  table
                    .getHeaderGroups()[0]
                    .headers.find((h) => h.id === cell.column.id);
                const isActionsCell = cell.column.id === "actions";

                return (
                  <div
                    key={cell.id}
                    className={`flex justify-between items-center ${
                      isActionsCell ? "mt-4" : ""
                    }`}
                  >
                    {!isActionsCell && (
                      <span className="font-bold text-sm">
                        {headerContext
                          ? flexRender(
                              cell.column.columnDef.header,
                              headerContext.getContext()
                            )
                          : null}
                      </span>
                    )}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
