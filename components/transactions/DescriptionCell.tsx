"use client";

import { memo, FocusEvent } from "react";
import type { Row } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { Input } from "@/components/ui/input";

interface DescriptionCellProps {
  row: Row<Transaction>;
}

function DescriptionCellComponent({ row }: DescriptionCellProps) {
  const { mutate: updateTransaction } = useUpdateTransactionMutation();
  const initialDescription = row.original.description;

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    if (newDescription !== initialDescription) {
      updateTransaction({
        id: row.original.id,
        data: { description: newDescription },
      });
    }
  };

  return (
    <Input
      key={initialDescription} // Re-mounts the component if the external value changes
      type="text"
      defaultValue={initialDescription || ""}
      onBlur={handleBlur}
      className="border rounded-md px-3 py-2 w-full truncate"
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
