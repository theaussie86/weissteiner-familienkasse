"use client";

import { useState } from "react";
import type { Row, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Account, Transaction } from "@/types";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/libs/utils";

interface AccountCellProps {
  row: Row<Transaction>;
  table: Table<Transaction>;
}

export function AccountCell({ row, table }: AccountCellProps) {
  const initialAccountId = row.original.account_id;
  const [open, setOpen] = useState(false);

  const { updateTransaction, accounts } = table.options.meta as {
    updateTransaction: (
      transactionId: string,
      data: Partial<Transaction>
    ) => void;
    accounts: Account[] | null;
  };

  const handleAccountSelect = (accountId: string) => {
    if (accountId !== initialAccountId) {
      updateTransaction(row.original.id, { account_id: accountId });
    }
    setOpen(false);
  };

  const currentAccount = accounts?.find(
    (acc) => String(acc.id) === String(initialAccountId)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {currentAccount ? currentAccount.name : "Wähle ein Konto..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Suche Konto..." />
          <CommandList>
            <CommandEmpty>Kein Konto gefunden.</CommandEmpty>
            <CommandGroup>
              {accounts?.map((account) => (
                <CommandItem
                  key={account.id}
                  value={String(account.id)}
                  onSelect={handleAccountSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(initialAccountId) === String(account.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {account.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
