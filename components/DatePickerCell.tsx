"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { Row, Table } from "@tanstack/react-table";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Transaction } from "@/types";
import { CalendarIcon } from "lucide-react";

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
  table: Table<Transaction>;
}

export function DatePickerCell({ row, table }: DatePickerCellProps) {
  const initialDateStr = row.original.created;
  const initialDate = initialDateStr ? new Date(initialDateStr) : new Date();
  const [date, setDate] = useState<Date>(initialDate);

  const { updateTransaction } = table.options.meta as {
    updateTransaction: (
      transactionId: string,
      data: Partial<Transaction>
    ) => void;
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      updateTransaction(row.original.id, { created: newDate.toISOString() });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="ml-2">{format(date, "PPP", { locale: de })}</span>
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
