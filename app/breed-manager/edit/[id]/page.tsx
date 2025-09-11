'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase-client';
import { Breed } from '@/lib/recommendation-engine';
import Link from 'next/link';

interface EditBreedProps {
  params: Promise<{ id: string }>;
}

export default function EditBreed({ params }: EditBreedProps) {
  const router = useRouter();
  // Unwrap Next.js route params (now a Promise in React 19/Next 15)
  const { id } = use(params);
  const [breed, setBreed] = useState<Breed | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('breeds')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setBreed(data);
      } catch (err) {
        console.error('Error fetching breed:', err);
        setError('Failed to load breed data');
      } finally {
        setLoading(false);
      }
    };
    fetchBreed();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!breed) return;

    setSaving(true);
    setError(null);
    
    try {
      console.log('Saving breed:', breed);
      
      // Clean the breed object:
      // - convert empty strings to null
      // - convert NaN numbers to null (JSON.stringify turns NaN into null anyway)
      // - remove immutable fields like id from the update payload
      const cleanedBreed = Object.fromEntries(
        Object.entries(breed).map(([key, value]) => {
          if (value === '') return [key, null];
          if (typeof value === 'number' && Number.isNaN(value)) return [key, null];
          return [key, value];
        })
      );
      // Exclude id from update to avoid accidental PK updates
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: __omitId, ...rest } = cleanedBreed as Record<string, unknown>;
      // Only include columns that actually exist in the 'breeds' table
      const allowedCols = new Set([
        'name','size','group','origin','breed_type','coat_type',
        'weight_min','weight_max','height_min','height_max','lifespan_min','lifespan_max',
        'monthly_cost_aud','popularity_rank',
        'energy_level','good_with_kids','good_with_pets','training_ease','grooming_needs','shedding_level','barking_level','apartment_friendly','drooling_tendency','separation_anxiety_risk','climate_suitability','noise_sensitivity',
        'description','temperament','exercise_needs','grooming','training','lifespan','shedding_description',
        'data_source','image_url','last_updated'
      ]);
      const updatePayload = Object.fromEntries(
        Object.entries(rest).filter(([k]) => allowedCols.has(k))
      );
      
      // Prefer secured server API for updates to avoid RLS/permission issues on the client
      const res = await fetch(`/api/admin/breeds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const msg = payload?.error || `Save failed with status ${res.status}`;
        throw new Error(msg);
      }

      console.log('Breed saved successfully');
      router.push('/breed-manager');
    } catch (err: unknown) {
      console.error('Error saving breed:', err);
      const message = err instanceof Error ? err.message : 'Failed to save breed. Please check the form data and try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !breed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error || 'Breed not found'}
          </div>
          <Link href="/breed-manager" className="mt-4 inline-block text-orange-600 hover:text-orange-800">
            ← Back to Breed Manager
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/breed-manager" className="text-orange-600 hover:text-orange-800 mb-4 inline-block">
            ← Back to Breed Manager
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit {breed.name}</h1>
        </div>

        <form onSubmit={handleSave} className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={breed.name}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={breed.size}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, size: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
                  <select
                    value={breed.group || breed.breed_group || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, group: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Group</option>
                    <option value="Sporting">Sporting</option>
                    <option value="Hound">Hound</option>
                    <option value="Working">Working</option>
                    <option value="Terrier">Terrier</option>
                    <option value="Toy">Toy</option>
                    <option value="Non-Sporting">Non-Sporting</option>
                    <option value="Herding">Herding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <input
                    type="text"
                    value={breed.origin || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, origin: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed Type</label>
                  <input
                    type="text"
                    value={breed.breed_type || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, breed_type: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coat Type</label>
                  <input
                    type="text"
                    value={breed.coat_type || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, coat_type: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Short, Long, Double, Wire"
                  />
                </div>
              </div>
            </div>

            {/* Physical Characteristics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Physical Characteristics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Weight (kg)</label>
                  <input
                    type="number"
                    value={breed.weight_min || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, weight_min: parseFloat(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight (kg)</label>
                  <input
                    type="number"
                    value={breed.weight_max || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, weight_max: parseFloat(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Height (cm)</label>
                  <input
                    type="number"
                    value={breed.height_min || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, height_min: parseFloat(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Height (cm)</label>
                  <input
                    type="number"
                    value={breed.height_max || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, height_max: parseFloat(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Lifespan (years)</label>
                  <input
                    type="number"
                    value={breed.lifespan_min || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, lifespan_min: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Lifespan (years)</label>
                  <input
                    type="number"
                    value={breed.lifespan_max || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, lifespan_max: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Cost (AUD)</label>
                  <input
                    type="number"
                    value={breed.monthly_cost_aud || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, monthly_cost_aud: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Popularity Rank</label>
                  <input
                    type="number"
                    value={breed.popularity_rank || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, popularity_rank: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Behavioral Characteristics (1-5 scale) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Behavioral Characteristics (1-5 scale)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.energy_level || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, energy_level: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Good with Kids</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.good_with_kids || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, good_with_kids: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Good with Pets</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.good_with_pets || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, good_with_pets: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Training Ease</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.training_ease || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, training_ease: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grooming Needs</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.grooming_needs || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, grooming_needs: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shedding Level</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.shedding_level || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, shedding_level: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barking Level</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.barking_level || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, barking_level: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apartment Friendly</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.apartment_friendly || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, apartment_friendly: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drooling Tendency</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.drooling_tendency || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, drooling_tendency: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Separation Anxiety Risk</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.separation_anxiety_risk || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, separation_anxiety_risk: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Climate Suitability</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.climate_suitability || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, climate_suitability: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Noise Sensitivity</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.noise_sensitivity || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, noise_sensitivity: parseInt(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Text Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={breed.description || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Detailed breed description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperament</label>
                  <input
                    type="text"
                    value={breed.temperament || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, temperament: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Friendly, Loyal, Energetic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Needs</label>
                  <textarea
                    value={breed.exercise_needs || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, exercise_needs: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Description of exercise requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grooming Information</label>
                  <textarea
                    value={breed.grooming || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, grooming: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Grooming requirements and tips..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Training Information</label>
                  <textarea
                    value={breed.training || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, training: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Training tips and considerations..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lifespan</label>
                  <input
                    type="text"
                    value={breed.lifespan || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, lifespan: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 12-14 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shedding Description</label>
                  <input
                    type="text"
                    value={breed.shedding_description || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, shedding_description: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Description of shedding patterns..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
                  <input
                    type="text"
                    value={breed.data_source || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, data_source: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Source of breed information"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={breed.image_url || ''}
                    onChange={(e) => setBreed(prev => prev ? { ...prev, image_url: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/dog-image.jpg"
                  />
                  {breed.image_url && (
                    <div className="mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={breed.image_url} 
                        alt={breed.name}
                        className="h-32 w-32 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <Link
              href="/breed-manager"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-orange-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}