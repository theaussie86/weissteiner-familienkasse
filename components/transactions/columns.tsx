"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Transaction, Account } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionsCell } from "./ActionsCell";
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
import { ChevronsUpDown, Check, Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/libs/utils";
import { useUpdateTransactionMutation } from "@/hooks/queries/transactions";
import { useState, useEffect } from "react";
import { AmountCell } from "./AmountCell";
import { DescriptionCell } from "./DescriptionCell";
import { DatePickerCell } from "./DatePickerCell";
import { PaidCell } from "./PaidCell";

const columnHelper = createColumnHelper<Transaction>();

export const columns = [
  columnHelper.accessor("created", {
    header: () => "Datum",
    cell: (props) => <DatePickerCell {...props} />,
  }),
  columnHelper.accessor("description", {
    header: () => "Beschreibung",
    cell: (props) => <DescriptionCell {...props} />,
  }),
  columnHelper.accessor("amount", {
    header: () => "Betrag",
    cell: (props) => <AmountCell {...props} />,
  }),
  columnHelper.accessor("account_id", {
    header: () => "Konto",
    cell: ({ row, table }) => {
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
                          onSelect={() => handleAccountSelect(account.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              accountId === account.id
                                ? "opacity-100"
                                : "opacity-0"
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
    },
  }),
  columnHelper.accessor("is_paid", {
    header: () => "Bezahlt",
    cell: (props) => <PaidCell {...props} />,
  }),
  columnHelper.display({
    id: "actions",
    header: () => null,
    cell: (props) => <ActionsCell {...props} />,
  }),
];
