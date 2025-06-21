import ButtonAccount from "@/components/ButtonAccount";
import TransactionsList from "@/components/TransactionsList";
import getQueryClient from "@/libs/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import { createClient } from "@/libs/supabase/server";
import Hydrate from "@/app/providers/Hydrate";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const queryClient = getQueryClient();
  const supabase = createClient();

  await queryClient.prefetchQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familienkasse_transactions")
        .select("*");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("familienkasse_accounts")
        .select("*");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <main className="min-h-screen p-8 pb-24">
        <section className="max-w-xl mx-auto space-y-8">
          <ButtonAccount />
          <h1 className="text-3xl md:text-4xl font-extrabold">Private Page</h1>
          <TransactionsList />
        </section>
      </main>
    </Hydrate>
  );
}
