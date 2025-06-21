"use client";

import { useEffect, useState } from "react";
import type { Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types";

interface AmountCellProps {
  row: Row<Transaction>;
  table: Table<Transaction>;
}

export function AmountCell({ row, table }: AmountCellProps) {
  const initialAmount = row.original.amount; // in cents
  const [displayValue, setDisplayValue] = useState(
    initialAmount !== null ? (initialAmount / 100).toFixed(2) : ""
  );

  const { updateTransaction } = table.options.meta as {
    updateTransaction: (
      transactionId: string,
      data: Partial<Transaction>
    ) => void;
  };

  useEffect(() => {
    const amountInCents = row.original.amount;
    setDisplayValue(
      amountInCents !== null ? (amountInCents / 100).toFixed(2) : ""
    );
  }, [row.original.amount]);

  const handleBlur = () => {
    const amountInEuros = parseFloat(displayValue.replace(",", "."));
    if (!isNaN(amountInEuros)) {
      const amountInCents = Math.round(amountInEuros * 100);
      if (amountInCents !== initialAmount) {
        updateTransaction(row.original.id, { amount: amountInCents });
      }
    } else {
      // Reset to original value if input is invalid
      setDisplayValue(
        initialAmount !== null ? (initialAmount / 100).toFixed(2) : ""
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        €
      </span>
      <Input
        type="number"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-32 pl-7"
      />
    </div>
  );
}
