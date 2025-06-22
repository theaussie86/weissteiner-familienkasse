"use client";

import { memo, FocusEvent } from "react";
import type { Row } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { Input } from "@/components/ui/input";

interface AmountCellProps {
  row: Row<Transaction>;
}

function AmountCellComponent({ row }: AmountCellProps) {
  const { mutate: updateTransaction } = useUpdateTransactionMutation();
  const initialAmount = row.original.amount;

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValueInCents = Math.round(Number(value) * 100);

    if (newValueInCents !== initialAmount) {
      updateTransaction({
        id: row.original.id,
        data: { amount: newValueInCents },
      });
    }
  };

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        €
      </span>
      <Input
        key={initialAmount}
        type="number"
        step="0.01"
        defaultValue={initialAmount != null ? initialAmount / 100 : ""}
        onBlur={handleBlur}
        className="border rounded-md pl-7 pr-3 py-2 w-28 text-right"
      />
    </div>
  );
}

const areEqual = (prevProps: AmountCellProps, nextProps: AmountCellProps) => {
  return prevProps.row.original.amount === nextProps.row.original.amount;
};

export const AmountCell = memo(AmountCellComponent, areEqual);
