import ButtonAccount from "@/components/ButtonAccount";
import TransactionsList from "@/components/TransactionsList";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const supabase = createClient();

  const transactionsPromise = supabase
    .from("familienkasse_transactions")
    .select();

  const accountsPromise = supabase.from("familienkasse_accounts").select();

  const [{ data: transactions }, { data: accounts }] = await Promise.all([
    transactionsPromise,
    accountsPromise,
  ]);

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        <h1 className="text-3xl md:text-4xl font-extrabold">Private Page</h1>
        <TransactionsList transactions={transactions} accounts={accounts} />
      </section>
    </main>
  );
}
