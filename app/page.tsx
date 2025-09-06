// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🐾 Pawfect Match</h1>
      <p className="text-lg">Find the dog breed that fits your lifestyle.</p>
      <div className="space-x-4">
        <Link className="underline" href="/breeds">Browse Breeds</Link>
        <Link className="underline" href="/auth">Sign In</Link>
        <Link className="underline" href="/test-supabase">Test Supabase</Link>
      </div>
    </main>
  );
}
