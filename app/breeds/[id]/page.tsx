// app/breeds/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

interface Breed {
  id: string;
  name: string;
  size: string;
  image_url: string | null;
  description: string;
  temperament: string;
  exercise_needs: string;
  training: string;
  grooming: string;
  origin: string;
  group: string;
}

interface PageProps {
  params: { id: string };
}

export default async function BreedDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: breed, error } = await supabase
    .from("breeds")
    .select("id, name, size, image_url, description, temperament, exercise_needs, training, grooming, origin, group")
    .eq("id", id)
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
          {breed.image_url ? (
            <img
              src={breed.image_url}
              alt={breed.name}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">{breed.name}</h1>
          <p className="text-lg text-gray-600 mb-2">{breed.size} • {breed.group}</p>
          <p className="text-md text-gray-500 mb-6">Origin: {breed.origin}</p>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{breed.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Temperament</h2>
            <p className="text-gray-700 leading-relaxed">{breed.temperament}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Exercise Needs</h2>
            <p className="text-gray-700 leading-relaxed">{breed.exercise_needs}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Training</h2>
            <p className="text-gray-700 leading-relaxed">{breed.training}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Grooming</h2>
            <p className="text-gray-700 leading-relaxed">{breed.grooming}</p>
          </div>
        </div>
      </div>
    </main>
  );
}