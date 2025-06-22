"use client";

import type { Row } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { memo } from "react";

interface PaidCellProps {
  row: Row<Transaction>;
}

function PaidCellComponent({ row }: PaidCellProps) {
  const {
    mutate: updateTransaction,
    isPending: isUpdating,
    variables: updatingVariables,
  } = useUpdateTransactionMutation();

  const isCurrentRowUpdating =
    isUpdating && updatingVariables?.id === row.original.id;

  if (isCurrentRowUpdating) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Checkbox
        checked={row.original.is_paid || false}
        onCheckedChange={(value) =>
          updateTransaction({
            id: row.original.id,
            data: { is_paid: !!value },
          })
        }
        aria-label="Bezahlt"
      />
    </div>
  );
}

const areEqual = (prevProps: PaidCellProps, nextProps: PaidCellProps) => {
  return prevProps.row.original.is_paid === nextProps.row.original.is_paid;
};

export const PaidCell = memo(PaidCellComponent, areEqual);
