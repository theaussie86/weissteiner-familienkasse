"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { DatePickerCell } from "./DatePickerCell";

// Updated transaction type to match the user's changes
type Transaction = {
  id: string;
  created: string;
  description: string | null;
  amount: number | null;
  account: string | null;
  is_paid: boolean | null;
  currency: string | null;
};

const columnHelper = createColumnHelper<Transaction>();

// This component is now responsible for rendering the responsive transactions table/list.
export default function TransactionsList({
  transactions: initialTransactions,
}: {
  transactions: Transaction[] | null;
}) {
  const [transactions, setTransactions] = useState(initialTransactions || []);

  // Update state if the initial props change
  useEffect(() => {
    setTransactions(initialTransactions || []);
  }, [initialTransactions]);

  const updateTransaction = (
    transactionId: string,
    data: Partial<Transaction>
  ) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((t) =>
        t.id === transactionId ? { ...t, ...data } : t
      )
    );
    // TODO: Here we will later call the server action to persist the change.
    console.log(`Should update transaction ${transactionId} with data:`, data);
  };

  const handlePaidChange = (transactionId: string, paid: boolean) => {
    updateTransaction(transactionId, { is_paid: paid });
  };

  const data = useMemo(() => transactions, [transactions]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("created", {
        header: () => "Datum",
        cell: ({ row, table }) => <DatePickerCell row={row} table={table} />,
      }),
      columnHelper.accessor("description", {
        header: () => "Beschreibung",
        cell: (info) => (
          <div className="p-2 border rounded-md bg-base-200/50">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("amount", {
        header: () => "Betrag",
        cell: (info) => (
          <div className="p-2 border rounded-md bg-base-200/50">
            {info.getValue() &&
              new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: info.row.original.currency || "EUR",
              }).format(info.getValue() as number)}
          </div>
        ),
      }),
      columnHelper.accessor("account", {
        header: () => "Konto",
        cell: (info) => (
          <div className="p-2 border rounded-md bg-base-200/50">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("is_paid", {
        header: () => "Bezahlt",
        cell: (info) => (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={info.getValue() || false}
              onChange={(e) =>
                handlePaidChange(info.row.original.id, e.target.checked)
              }
              className="checkbox"
            />
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: () => (
          <div className="flex justify-center">
            <button className="btn btn-ghost btn-sm">🗑️</button>
          </div>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateTransaction,
    },
  });

  if (!transactions || transactions.length === 0) {
    return <p>Keine Transaktionen gefunden.</p>;
  }

  return (
    <div className="w-full">
      {/* Desktop View: Table */}
      <div className="hidden md:block">
        <table className="table w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2">
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
                return (
                  <div
                    key={cell.id}
                    className="flex justify-between items-center"
                  >
                    <span className="font-bold text-sm">
                      {headerContext
                        ? flexRender(
                            cell.column.columnDef.header,
                            headerContext.getContext()
                          )
                        : null}
                    </span>
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
