"use client";

import { memo } from "react";
import type { Row } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { Checkbox } from "@/components/ui/checkbox";

interface PaidCellProps {
  row: Row<Transaction>;
}

function PaidCellComponent({ row }: PaidCellProps) {
  const { mutate: updateTransaction } = useUpdateTransactionMutation();
  const isPaid = row.original.is_paid;

  const handleCheckedChange = (checked: boolean) => {
    updateTransaction({
      id: row.original.id,
      data: { is_paid: checked },
    });
  };

  return (
    <div className="text-left">
      <Checkbox
        checked={isPaid || false}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}

const areEqual = (prevProps: PaidCellProps, nextProps: PaidCellProps) => {
  return prevProps.row.original.is_paid === nextProps.row.original.is_paid;
};

export const PaidCell = memo(PaidCellComponent, areEqual);
