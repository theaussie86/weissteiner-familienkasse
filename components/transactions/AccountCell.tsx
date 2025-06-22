"use client";

import { useState, memo } from "react";
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
import { ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/libs/utils";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";

interface AccountCellProps {
  row: Row<Transaction>;
  table: Table<Transaction>;
}

function AccountCellComponent({ row, table }: AccountCellProps) {
  const accountId = row.original.account_id;
  const [open, setOpen] = useState(false);

  const { accounts, accountsMap } = table.options.meta as {
    accounts: Account[];
    accountsMap: Map<string, string>;
  };

  const currentAccountName =
    accountsMap?.get(accountId || "") || "Wähle ein Konto...";

  const { mutate: updateTransaction } = useUpdateTransactionMutation();

  const handleAccountSelect = (newAccountId: string) => {
    if (newAccountId !== accountId) {
      updateTransaction({
        id: row.original.id,
        data: { account_id: newAccountId },
      });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {currentAccountName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Suche Konto..." />
          <CommandList>
            {!accounts ? (
              <div className="flex justify-center items-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>Kein Konto gefunden.</CommandEmpty>
                <CommandGroup>
                  {accounts.map((account) => (
                    <CommandItem
                      key={account.id}
                      value={String(account.id)}
                      onSelect={handleAccountSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          accountId === account.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {account.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const areEqual = (prevProps: AccountCellProps, nextProps: AccountCellProps) => {
  return (
    prevProps.row.original.account_id === nextProps.row.original.account_id &&
    prevProps.table.options.meta === nextProps.table.options.meta
  );
};

export const AccountCell = memo(AccountCellComponent, areEqual);
