"use client";

import { useEffect, useState } from "react";
import type { Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types";

interface DescriptionCellProps {
  row: Row<Transaction>;
  table: Table<Transaction>;
}

export function DescriptionCell({ row, table }: DescriptionCellProps) {
  const initialDescription = row.original.description || "";
  const [description, setDescription] = useState(initialDescription);

  const { updateTransaction } = table.options.meta as {
    updateTransaction: (
      transactionId: string,
      data: Partial<Transaction>
    ) => void;
  };

  useEffect(() => {
    setDescription(row.original.description || "");
  }, [row.original.description]);

  const handleBlur = () => {
    if (description !== row.original.description) {
      updateTransaction(row.original.id, { description });
    }
  };

  return (
    <Input
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      onBlur={handleBlur}
      className="w-full"
    />
  );
}
