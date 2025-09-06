// app/breeds/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

interface Breed {
  id: number;
  name: string;
  size: string;
  image_url: string;
  description: string;
  traits: string;
}

interface PageProps {
  params: { id: string };
}

export default async function BreedDetailPage({ params }: PageProps) {
  const supabase = supabaseServer();
  const { data: breed, error } = await supabase
    .from("breeds")
    .select("id, name, size, image_url, description, traits")
    .eq("id", params.id)
    .single();

  if (error || !breed) {
    notFound();
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/breeds" className="text-blue-600 hover:underline">← Back to Breeds</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={breed.image_url}
            alt={breed.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">{breed.name}</h1>
          <p className="text-lg text-gray-600 mb-6">{breed.size}</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{breed.description}</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-3">Traits</h2>
            <p className="text-gray-700 leading-relaxed">{breed.traits}</p>
          </div>
        </div>
      </div>
    </main>
  );
}