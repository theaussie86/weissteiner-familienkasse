"use client";

import { useMemo, memo } from "react";
import type { Row } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { useDebouncedCallback } from "use-debounce";

interface AmountCellProps {
  row: Row<Transaction>;
}

function AmountCellComponent({ row }: AmountCellProps) {
  const initialAmount = useMemo(
    () => row.original.amount,
    [row.original.amount]
  );
  const initialDisplayValue = useMemo(
    () => (initialAmount !== null ? (initialAmount / 100).toFixed(2) : ""),
    [initialAmount]
  );

  const { mutate: updateTransaction } = useUpdateTransactionMutation();

  const debouncedUpdate = useDebouncedCallback((value: string) => {
    const amountInEuros = parseFloat(value.replace(",", "."));
    if (!isNaN(amountInEuros)) {
      const amountInCents = Math.round(amountInEuros * 100);
      if (amountInCents !== initialAmount) {
        updateTransaction({
          id: row.original.id,
          data: { amount: amountInCents },
        });
      }
    }
  }, 500);

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        €
      </span>
      <Input
        type="text"
        inputMode="decimal"
        defaultValue={initialDisplayValue}
        onChange={(e) => debouncedUpdate(e.target.value)}
        onBlur={(e) => {
          // Format the value on blur
          const amountInEuros = parseFloat(e.target.value.replace(",", "."));
          if (!isNaN(amountInEuros)) {
            e.target.value = amountInEuros.toFixed(2);
          } else {
            e.target.value = initialDisplayValue;
          }
        }}
        className="w-32 pl-7"
      />
    </div>
  );
}

const areEqual = (prevProps: AmountCellProps, nextProps: AmountCellProps) => {
  return prevProps.row.original.amount === nextProps.row.original.amount;
};

export const AmountCell = memo(AmountCellComponent, areEqual);
