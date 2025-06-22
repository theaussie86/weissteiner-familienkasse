"use client";

import { memo } from "react";
import type { Row } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/libs/utils";
import { CalendarIcon } from "lucide-react";
import { de } from "date-fns/locale";

// Re-using the transaction type, let's ensure it's correct
// type Transaction = {
//   id: string;
//   created: string; // Assuming 'created' is the date field
//   description: string | null;
//   amount: number | null;
//   account: string | null;
//   is_paid: boolean | null;
//   currency: string | null;
// };

interface DatePickerCellProps {
  row: Row<Transaction>;
}

function DatePickerCellComponent({ row }: DatePickerCellProps) {
  const { mutate: updateTransaction } = useUpdateTransactionMutation();
  const date = row.original.created
    ? new Date(row.original.created)
    : undefined;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      updateTransaction({
        id: row.original.id,
        data: { created: selectedDate.toISOString() },
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            date.toLocaleDateString("de-DE")
          ) : (
            <span>Wähle ein Datum</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={de}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const areEqual = (
  prevProps: DatePickerCellProps,
  nextProps: DatePickerCellProps
) => {
  return prevProps.row.original.created === nextProps.row.original.created;
};

export const DatePickerCell = memo(DatePickerCellComponent, areEqual);
