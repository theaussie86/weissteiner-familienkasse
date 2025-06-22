"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { DatePickerCell } from "./DatePickerCell";
import { DescriptionCell } from "./DescriptionCell";
import { AmountCell } from "./AmountCell";
import { AccountCell } from "./AccountCell";
import { PaidCell } from "./PaidCell";
import { ActionsCell } from "./ActionsCell";

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
    cell: (props) => <AccountCell {...props} />,
  }),
  columnHelper.accessor("is_paid", {
    header: () => "Bezahlt",
    cell: ({ row }) => <PaidCell row={row} />,
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => <ActionsCell row={props.row} />,
  }),
];
