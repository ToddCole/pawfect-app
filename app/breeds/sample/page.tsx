import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export default async function SampleBreedPage() {
  const supabase = await supabaseServer();
  // Get total count first
  const { count } = await supabase
    .from("breeds")
    .select("*", { count: "exact", head: true });

  if (!count || count === 0) {
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">No Breeds Found</h1>
        <p className="text-gray-600">
          No breeds are available in the database yet.
        </p>
      </main>
    );
  }

  // Get a random offset
  const randomOffset = Math.floor(Math.random() * count);

  // Get the random breed
  const { data, error } = await supabase
    .from("breeds")
    .select("id")
    .range(randomOffset, randomOffset)
    .single();

  if (error || !data) {
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">No Breeds Found</h1>
        <p className="text-gray-600">
          No breeds are available in the database yet.
        </p>
      </main>
    );
  }

  redirect(`/breeds/${data.id}`);
}