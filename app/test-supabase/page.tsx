// app/test-supabase/page.tsx
import { supabaseServer } from "@/lib/supabase-server";

export default async function TestSupabase() {
  const sb = supabaseServer();

  // Count rows without fetching them
  const { count, error } = await sb
    .from("breeds")
    .select("*", { count: "exact", head: true });

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Supabase Connectivity Check</h1>
      {error ? (
        <p style={{ color: "crimson" }}>Error: {error.message}</p>
      ) : (
        <p>✅ Connected. Breeds in DB: <strong>{count ?? 0}</strong></p>
      )}
      <p style={{ marginTop: 12 }}>
        URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "missing"} | ANON KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "missing"}
      </p>
    </main>
  );
}
