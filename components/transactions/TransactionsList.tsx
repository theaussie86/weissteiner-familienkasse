"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState, useCallback } from "react";
import { columns } from "./columns";
import { useTransactionsPaginationQuery } from "@/hooks/queries/transactions";
import { useAccountsQuery } from "@/hooks/queries/accounts";
import { Button } from "../ui/button";
import { NewTransactionModal } from "./NewTransactionModal";
import { Pagination } from "./Pagination";

export default function TransactionsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: paginationData,
    isLoading: isLoadingTransactions,
    error: errorTransactions,
  } = useTransactionsPaginationQuery(currentPage, pageSize);

  const transactions = paginationData?.data || [];

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: errorAccounts,
  } = useAccountsQuery();

  const accountsMap = useMemo(() => {
    if (!accounts) return new Map();
    return new Map(accounts.map((account) => [account.id, account.name]));
  }, [accounts]);

  const table = useReactTable({
    data: transactions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id, // Verwende die eindeutige Transaction ID als row ID
    meta: {
      accounts,
      accountsMap,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (isLoadingTransactions || isLoadingAccounts) {
    return <p>Lade Daten...</p>;
  }

  if (errorTransactions || errorAccounts) {
    return <p>Fehler beim Laden der Daten.</p>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Letzte Transaktionen</h2>
          <Button onClick={() => setIsModalOpen(true)}>Neue Transaktion</Button>
        </div>
        <p>Keine Transaktionen gefunden.</p>
        <NewTransactionModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Letzte Transaktionen</h2>
        <Button onClick={() => setIsModalOpen(true)}>Neue Transaktion</Button>
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
        {paginationData && (
          <Pagination
            currentPage={paginationData.page}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
            totalItems={paginationData.total}
            pageSize={paginationData.pageSize}
          />
        )}
      </div>

      {/* Mobile View: Cards */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="p-4 space-y-4 border rounded-lg shadow bg-base-100"
            >
              {row.getVisibleCells().map((cell) => {
                const headerContext =
                  cell.column.columnDef.header &&
                  table
                    .getHeaderGroups()[0]
                    .headers.find((h) => h.id === cell.column.id);
                const isActionsCell = cell.column.id === "actions";

                if (isActionsCell) {
                  return (
                    <div key={cell.id} className="flex justify-end pt-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  );
                }

                return (
                  <div key={cell.id} className="flex flex-col">
                    <span className="font-bold text-sm mb-1">
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
        {paginationData && (
          <Pagination
            currentPage={paginationData.page}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
            totalItems={paginationData.total}
            pageSize={paginationData.pageSize}
          />
        )}
      </div>
      <NewTransactionModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
