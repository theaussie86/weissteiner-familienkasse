"use client";

import { useAccountSummariesQuery } from "@/hooks/queries/accounts";
import { cn } from "@/libs/utils";
import { Vault, Gift, LineChart, Wallet } from "lucide-react";

const AccountSummaries = () => {
  const { data: accountSummaries, isLoading } = useAccountSummariesQuery();

  const getIcon = (accountName: string) => {
    const props = { className: "w-6 h-6" };
    switch (accountName) {
      case "Sparen":
        return <Vault {...props} />;
      case "Spenden":
        return <Gift {...props} />;
      case "Investieren":
        return <LineChart {...props} />;
      default:
        return <Wallet {...props} />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
            <div className="card-body">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {accountSummaries?.map((account) => (
        <div key={account.id} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    "bg-primary text-primary-content"
                  )}
                >
                  {getIcon(account.name)}
                </div>
                <div>
                  <h2 className="card-title">{account.name}</h2>
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format((account.ist_balance || 0) / 100)}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      (Soll:{" "}
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format((account.soll_balance || 0) / 100)}
                      )
                    </span>
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  account.ist_balance >= account.soll_balance
                    ? "bg-green-500"
                    : "bg-red-500"
                )}
              ></div>
            </div>
            {/* <div className="card-actions justify-start mt-4">
              <button className="btn btn-ghost btn-sm">Alle anzeigen</button>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountSummaries;
