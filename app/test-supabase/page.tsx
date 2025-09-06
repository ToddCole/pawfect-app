// app/test-supabase/page.tsx
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function TestSupabasePage() {
  let connectionStatus = "";
  let breedCount = 0;

  try {
    const supabase = supabaseServer();
    const { count, error } = await supabase
      .from("breeds")
      .select("*", { count: "exact", head: true });

    if (error) {
      connectionStatus = `❌ Error: ${error.message}`;
    } else {
      connectionStatus = "✅ Connected";
      breedCount = count || 0;
    }
  } catch (err) {
    connectionStatus = `❌ Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <p className="text-lg mb-4">{connectionStatus}</p>
        
        {connectionStatus.includes("✅") && (
          <p className="text-lg">
            <strong>Breeds in DB:</strong> {breedCount}
          </p>
        )}
      </div>
      
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Environment Check</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p>
            <strong>Supabase URL:</strong>{" "}
            <span className="font-mono text-sm">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
            </span>
          </p>
          <p>
            <strong>Supabase Anon Key:</strong>{" "}
            <span className="font-mono text-sm">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
            </span>
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="space-x-4">
          <Link href="/api/ping" className="text-blue-600 hover:underline">
            API Ping Test
          </Link>
          <Link href="/breeds" className="text-blue-600 hover:underline">
            View Breeds
          </Link>
        </div>
      </div>
    </main>
  );
}
