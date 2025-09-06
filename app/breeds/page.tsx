'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation";

interface Breed {
  id: string;
  name: string;
  size: string;
  image_url?: string;
  group?: string;
  temperament?: string;
  energy_level?: number;
  good_with_kids?: number;
  training_ease?: number;
}

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds');
        if (!response.ok) {
          throw new Error('Failed to fetch breeds');
        }
        const data = await response.json();
        setBreeds(data.breeds || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load breeds');
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Navigation showQuizButton={false} />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Loading breeds...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Navigation showQuizButton={false} />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Breeds</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navigation showQuizButton={false} />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🐾 Browse All Dog Breeds
          </h1>
          <p className="text-xl text-gray-600">
            Explore {breeds?.length || 0}+ dog breeds and find your perfect companion
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search breeds..."
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="">All Groups</option>
              <option value="Working">Working</option>
              <option value="Sporting">Sporting</option>
              <option value="Herding">Herding</option>
              <option value="Terrier">Terrier</option>
              <option value="Toy">Toy</option>
              <option value="Hound">Hound</option>
            </select>
            <Link
              href="/"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
            >
              Take Quiz Instead
            </Link>
          </div>
        </div>

        {/* Breeds Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {breeds?.map((breed) => (
            <Link key={breed.id} href={`/breeds/${breed.id}`}>
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                {/* Breed Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {breed.image_url ? (
                    <img 
                      src={breed.image_url} 
                      alt={breed.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/300/200';
                      }}
                    />
                  ) : (
                    <span className="text-4xl">🐕</span>
                  )}
                </div>

                {/* Breed Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{breed.name}</h3>
                    <p className="text-sm text-gray-600">{breed.size} • {breed.group}</p>
                  </div>

                  {/* Key Characteristics */}
                  {(breed.energy_level || breed.good_with_kids || breed.training_ease) && (
                    <div className="space-y-2">
                      {breed.energy_level && (
                        <div className="flex justify-between text-sm">
                          <span>Energy Level:</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${(breed.energy_level / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{breed.energy_level}/5</span>
                          </div>
                        </div>
                      )}

                      {breed.good_with_kids && (
                        <div className="flex justify-between text-sm">
                          <span>Good with Kids:</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${(breed.good_with_kids / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{breed.good_with_kids}/5</span>
                          </div>
                        </div>
                      )}

                      {breed.training_ease && (
                        <div className="flex justify-between text-sm">
                          <span>Training Ease:</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${(breed.training_ease / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{breed.training_ease}/5</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Temperament Preview */}
                  {breed.temperament && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {breed.temperament}
                      </p>
                    </div>
                  )}

                  {/* Action Hint */}
                  <div className="pt-2">
                    <div className="w-full text-center py-2 text-orange-600 text-sm font-medium">
                      Click to Learn More →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {breeds?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No breeds found.</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not Sure Which Breed is Right?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Take our personalized quiz to get breed recommendations tailored to your lifestyle.
          </p>
          <Link 
            href="/"
            className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
          >
            🎯 Take the Quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
