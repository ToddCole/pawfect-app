import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function BreedsPage() {
  const sb = supabaseServer();
  const { data: breeds, error } = await sb
    .from("breeds")
    .select("id,name,size,image_url")
    .order("name");

  if (error) return <main className="p-8">DB error: {error.message}</main>;

  return (
    <main className="p-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {breeds?.map((b) => (
        <Link key={b.id} href={`/breeds/${b.id}`} className="border rounded p-4 space-y-2 hover:shadow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {b.image_url ? <img src={b.image_url} alt={b.name} className="w-full h-40 object-cover rounded" /> : null}
          <div className="font-semibold">{b.name}</div>
          <div className="text-sm opacity-70">{b.size ?? "—"}</div>
        </Link>
      ))}
    </main>
  );
}
