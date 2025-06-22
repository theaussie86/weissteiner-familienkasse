"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateTransactionMutation } from "@/hooks/queries/transactions";
import { useAccountsQuery } from "@/hooks/queries/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Account, Transaction } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/libs/utils";

interface NewTransactionFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

type FormData = {
  description: string;
  amount: number;
  accountId: string;
  created: Date;
};

export function NewTransactionForm({ setIsOpen }: NewTransactionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      created: new Date(),
      description: "",
      accountId: "",
    },
  });
  const { data: accounts } = useAccountsQuery();
  const { mutate: createTransaction, isPending } =
    useCreateTransactionMutation();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = (data: FormData) => {
    setApiError(null);
    const newTransaction: Partial<Transaction> = {
      description: data.description,
      amount: data.amount * 100,
      account_id: data.accountId,
      is_paid: false,
      created: data.created.toISOString(),
    };

    createTransaction(newTransaction, {
      onSuccess: () => {
        setIsOpen(false);
      },
      onError: (error) => {
        setApiError(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Beschreibung
        </label>
        <Input
          id="description"
          {...register("description", {
            required: "Beschreibung ist erforderlich",
          })}
          placeholder="z.B. Kindergeld"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Betrag
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Betrag ist erforderlich",
            valueAsNumber: true,
          })}
          placeholder="z.B. 250"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="created" className="block text-sm font-medium">
          Datum
        </label>
        <Controller
          control={control}
          name="created"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP", { locale: de })
                  ) : (
                    <span>Wähle ein Datum</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.created && (
          <p className="text-red-500 text-xs mt-1">{errors.created.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="account" className="block text-sm font-medium">
          Konto
        </label>
        <Controller
          control={control}
          name="accountId"
          rules={{ required: "Konto ist erforderlich" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Konto auswählen" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account: Account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.accountId && (
          <p className="text-red-500 text-xs mt-1">
            {errors.accountId.message}
          </p>
        )}
      </div>

      {apiError && <p className="text-sm text-red-500">{apiError}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Wird erstellt..." : "Erstellen"}
        </Button>
      </div>
    </form>
  );
}
