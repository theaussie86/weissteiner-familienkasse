"use client";

import { memo } from "react";
import type { Row } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { Trash2 } from "lucide-react";
import { useDeleteTransactionMutation } from "@/hooks/queries/transactions";

interface ActionsCellProps {
  row: Row<Transaction>;
}

function ActionsCellComponent({ row }: ActionsCellProps) {
  const { mutate: deleteTransaction } = useDeleteTransactionMutation();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => {
          // Optional: Add a confirmation modal before deleting
          deleteTransaction(row.original.id);
        }}
        className="btn btn-ghost btn-sm"
        aria-label="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

const areEqual = (prevProps: ActionsCellProps, nextProps: ActionsCellProps) => {
  return prevProps.row.original.id === nextProps.row.original.id;
};

export const ActionsCell = memo(ActionsCellComponent, areEqual);
