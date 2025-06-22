"use client";

import { useMemo, memo } from "react";
import type { Row } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { useDebouncedCallback } from "use-debounce";

interface DescriptionCellProps {
  row: Row<Transaction>;
}

function DescriptionCellComponent({ row }: DescriptionCellProps) {
  const initialDescription = useMemo(
    () => row.original.description || "",
    [row.original.description]
  );

  const { mutate: updateTransaction } = useUpdateTransactionMutation();

  const debouncedUpdate = useDebouncedCallback((value: string) => {
    if (value !== initialDescription) {
      updateTransaction({
        id: row.original.id,
        data: { description: value },
      });
    }
  }, 500);

  return (
    <Input
      defaultValue={initialDescription}
      onChange={(e) => debouncedUpdate(e.target.value)}
      className="w-full"
    />
  );
}

const areEqual = (
  prevProps: DescriptionCellProps,
  nextProps: DescriptionCellProps
) => {
  return (
    prevProps.row.original.description === nextProps.row.original.description
  );
};

export const DescriptionCell = memo(DescriptionCellComponent, areEqual);
