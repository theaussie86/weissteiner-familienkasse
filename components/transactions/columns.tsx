"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { ActionsCell } from "./ActionsCell";
import { AccountCell } from "./AccountCell";
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
    cell: (props) => <AccountCell {...props} />,
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
