'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase-client';
import Link from 'next/link';

interface NewBreed {
  name: string;
  size: string;
  group: string;
  origin: string;
  energy_level: number;
  good_with_kids: number;
  good_with_pets: number;
  training_ease: number;
  grooming_needs: number;
  barking_level: number;
  shedding_level: number;
  apartment_friendly: number;
  drooling_tendency: number;
  separation_anxiety_risk: number;
  climate_suitability: number;
  noise_sensitivity: number;
  description: string;
  temperament: string;
  exercise_needs: string;
  grooming: string;
  training: string;
  lifespan: string;
  shedding_description: string;
  image_url: string;
  weight_min: number;
  weight_max: number;
  height_min: number;
  height_max: number;
  lifespan_min: number;
  lifespan_max: number;
  breed_type: string;
  popularity_rank: number;
  monthly_cost_aud: number;
  coat_type: string;
  data_source: string;
}

export default function NewBreed() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breed, setBreed] = useState<NewBreed>({
    name: '',
    size: 'Medium',
    group: '',
    origin: '',
    breed_type: '',
    coat_type: '',
    energy_level: 3,
    good_with_kids: 3,
    good_with_pets: 3,
    training_ease: 3,
    grooming_needs: 3,
    barking_level: 3,
    shedding_level: 3,
    apartment_friendly: 3,
    drooling_tendency: 3,
    separation_anxiety_risk: 3,
    climate_suitability: 3,
    noise_sensitivity: 3,
    description: '',
    temperament: '',
    exercise_needs: '',
    grooming: '',
    training: '',
    lifespan: '',
    shedding_description: '',
    image_url: '',
    weight_min: 0,
    weight_max: 0,
    height_min: 0,
    height_max: 0,
    lifespan_min: 0,
    lifespan_max: 0,
    popularity_rank: 0,
    monthly_cost_aud: 0,
    data_source: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      console.log('Creating new breed:', breed);
      
      // Clean the breed object - remove any undefined values and convert empty strings to null
      const cleanedBreed = Object.fromEntries(
        Object.entries(breed).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      );
      
      // Remove fields that shouldn't be zero
      if (cleanedBreed.weight_min === 0) cleanedBreed.weight_min = null;
      if (cleanedBreed.weight_max === 0) cleanedBreed.weight_max = null;
      if (cleanedBreed.height_min === 0) cleanedBreed.height_min = null;
      if (cleanedBreed.height_max === 0) cleanedBreed.height_max = null;
      if (cleanedBreed.lifespan_min === 0) cleanedBreed.lifespan_min = null;
      if (cleanedBreed.lifespan_max === 0) cleanedBreed.lifespan_max = null;
      if (cleanedBreed.popularity_rank === 0) cleanedBreed.popularity_rank = null;
      if (cleanedBreed.monthly_cost_aud === 0) cleanedBreed.monthly_cost_aud = null;
      
      console.log('Cleaned breed data:', cleanedBreed);

      const { data, error } = await supabaseClient
        .from('breeds')
        .insert([cleanedBreed])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error saving new breed: ${error.message}`);
      }

      console.log('New breed created successfully:', data);
      router.push('/breed-manager');
    } catch (error: unknown) {
      console.error('Error creating breed:', error);
      let message: string | undefined;
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message || 'Database error saving new breed. Please check the form data and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/breed-manager" className="text-orange-600 hover:text-orange-800 mb-4 inline-block">
            ← Back to Breed Manager
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Breed</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={breed.name}
                  onChange={(e) => setBreed(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  value={breed.size}
                  onChange={(e) => setBreed(prev => ({ ...prev, size: e.target.value }))}
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
            value={breed.group}
            onChange={(e) => setBreed(prev => ({ ...prev, group: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  value={breed.origin}
                  onChange={(e) => setBreed(prev => ({ ...prev, origin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Germany, England"
                />
              </div>
            </div>

            {/* Characteristics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Characteristics (1-5 scale)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energy Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.energy_level}
                    onChange={(e) => setBreed(prev => ({ ...prev, energy_level: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Good with Kids
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.good_with_kids}
                    onChange={(e) => setBreed(prev => ({ ...prev, good_with_kids: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Ease
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={breed.training_ease}
                    onChange={(e) => setBreed(prev => ({ ...prev, training_ease: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={breed.description}
                onChange={(e) => setBreed(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Detailed description of the breed..."
              />
            </div>

            {/* Temperament */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperament
              </label>
              <input
                type="text"
                value={breed.temperament}
                onChange={(e) => setBreed(prev => ({ ...prev, temperament: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Friendly, Loyal, Energetic"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={breed.image_url}
                onChange={(e) => setBreed(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/dog-image.jpg"
              />
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
              disabled={saving || !breed.name}
              className="px-4 py-2 bg-orange-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Breed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}