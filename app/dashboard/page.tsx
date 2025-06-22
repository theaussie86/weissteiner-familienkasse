import AccountSummaries from "@/components/AccountSummaries";
import ButtonAccount from "@/components/ButtonAccount";
import TransactionsList from "@/components/transactions/TransactionsList";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="mx-auto px-4 space-y-8">
        <ButtonAccount />
        <h1 className="text-2xl font-bold">Aktueller Stand</h1>
        <AccountSummaries />
        <TransactionsList />
      </section>
    </main>
  );
}
