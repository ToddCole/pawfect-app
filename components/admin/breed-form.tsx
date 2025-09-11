'use client';

import { useState } from 'react';
import { Breed } from '@/lib/recommendation-engine';
import { supabaseClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

interface BreedFormData extends Omit<Breed, 'id'> {
  id?: string;
}

interface BreedFormProps {
  breed?: Breed;
  onSave?: (breed: Breed) => void;
}

const initialFormData: BreedFormData = {
  name: '',
  size: '',
  energy_level: 3,
  good_with_kids: 3,
  training_ease: 3,
  grooming_needs: 3,
  barking_level: 3,
  shedding_level: 3,
  temperament: '',
  exercise_needs: '',
  grooming: '',
  training: '',
  origin: '',
  group: '',
  apartment_friendly: 3,
  good_with_pets: 3,
  description: '',
  weight_min: 0,
  weight_max: 0,
  breed_type: '',
  popularity_rank: 0,
  data_source: 'admin',
  last_updated: null,
  height_min: 0,
  height_max: 0,
  lifespan_min: 0,
  lifespan_max: 0,
  drooling_tendency: 3,
  separation_anxiety_risk: 3,
  climate_suitability: 3,
  noise_sensitivity: 3,
  monthly_cost_aud: 0,
  coat_type: '',
  image_url: '',
  lifespan: '',
  shedding_description: ''
};

export default function BreedForm({ breed, onSave }: BreedFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BreedFormData>(() => {
    if (breed) {
      // Clean the breed data to ensure no null values
      const cleanedBreed = { ...breed };
      Object.keys(cleanedBreed).forEach(key => {
        if (cleanedBreed[key as keyof typeof cleanedBreed] === null) {
          if (typeof initialFormData[key as keyof typeof initialFormData] === 'string') {
            (cleanedBreed as any)[key] = '';
          } else if (typeof initialFormData[key as keyof typeof initialFormData] === 'number') {
            (cleanedBreed as any)[key] = 0;
          }
        }
      });
      return cleanedBreed;
    }
    return initialFormData;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseInt(value)) : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Prepare data for saving
      const saveData = {
        ...formData,
        last_updated: {
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        }
      };

      // Calculate computed lifespan if min/max provided
      if (saveData.lifespan_min && saveData.lifespan_max) {
        if (saveData.lifespan_min === saveData.lifespan_max) {
          saveData.lifespan = `${saveData.lifespan_min} years`;
        } else {
          saveData.lifespan = `${saveData.lifespan_min}-${saveData.lifespan_max} years`;
        }
      }

      let result;
      
      if (breed?.id) {
        // Update existing breed - remove id from saveData to avoid conflicts
        const { id, ...updateData } = saveData;
        console.log('Updating breed with ID:', breed.id);
        console.log('Update data:', updateData);
        
        result = await supabaseClient
          .from('breeds')
          .update(updateData)
          .eq('id', breed.id)
          .select()
          .single();
      } else {
        // Create new breed - remove id from saveData
        const { id, ...insertData } = saveData;
        console.log('Creating new breed with data:', insertData);
        
        result = await supabaseClient
          .from('breeds')
          .insert([insertData])
          .select()
          .single();
      }

      console.log('Database result:', result);
      
      if (result.error) {
        console.error('Database error:', result.error);
        throw result.error;
      }

      if (onSave) {
        onSave(result.data);
      } else {
        router.push('/admin/breeds');
      }
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        supabaseError: error
      });
      
      let errorMessage = 'Failed to save breed';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const sizeOptions = [
    'Toy', 'Small', 'Medium', 'Large', 'Extra Large'
  ];

  const breedTypeOptions = [
    'Pure Breed', 'Mixed Breed', 'Designer Breed'
  ];

  const coatTypeOptions = [
    'Short', 'Medium', 'Long', 'Curly', 'Wiry', 'Double Coat', 'Hairless'
  ];

  const groupOptions = [
    'Sporting', 'Working', 'Terrier', 'Toy', 'Non-Sporting', 
    'Herding', 'Hound', 'Foundation Stock Service', 'Miscellaneous'
  ];

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breed Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size *
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Size</option>
              {sizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Group</option>
              {groupOptions.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breed Type
            </label>
            <select
              name="breed_type"
              value={formData.breed_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Type</option>
              {breedTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coat Type
            </label>
            <select
              name="coat_type"
              value={formData.coat_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Coat Type</option>
              {coatTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Popularity Rank
            </label>
            <input
              type="number"
              name="popularity_rank"
              value={formData.popularity_rank || ''}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Physical Characteristics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Physical Characteristics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Weight (kg)
            </label>
            <input
              type="number"
              name="weight_min"
              value={formData.weight_min || ''}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Weight (kg)
            </label>
            <input
              type="number"
              name="weight_max"
              value={formData.weight_max || ''}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Height (cm)
            </label>
            <input
              type="number"
              name="height_min"
              value={formData.height_min || ''}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Height (cm)
            </label>
            <input
              type="number"
              name="height_max"
              value={formData.height_max || ''}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Lifespan (years)
            </label>
            <input
              type="number"
              name="lifespan_min"
              value={formData.lifespan_min || ''}
              onChange={handleChange}
              min="0"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Lifespan (years)
            </label>
            <input
              type="number"
              name="lifespan_max"
              value={formData.lifespan_max || ''}
              onChange={handleChange}
              min="0"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Cost (AUD)
            </label>
            <input
              type="number"
              name="monthly_cost_aud"
              value={formData.monthly_cost_aud || ''}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Temperament & Behaviour Ratings (1-5 scale) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Temperament & Behaviour (1-5 Scale)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'energy_level', label: 'Energy Level' },
            { name: 'good_with_kids', label: 'Good with Kids' },
            { name: 'training_ease', label: 'Training Ease' },
            { name: 'grooming_needs', label: 'Grooming Needs' },
            { name: 'barking_level', label: 'Barking Level' },
            { name: 'shedding_level', label: 'Shedding Level' },
            { name: 'apartment_friendly', label: 'Apartment Friendly' },
            { name: 'good_with_pets', label: 'Good with Pets' },
            { name: 'drooling_tendency', label: 'Drooling Tendency' },
            { name: 'separation_anxiety_risk', label: 'Separation Anxiety Risk' },
            { name: 'climate_suitability', label: 'Climate Suitability' },
            { name: 'noise_sensitivity', label: 'Noise Sensitivity' }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <select
                name={field.name}
                value={formData[field.name as keyof BreedFormData] as number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                {[1, 2, 3, 4, 5].map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Descriptions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperament
            </label>
            <textarea
              name="temperament"
              value={formData.temperament}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Needs
              </label>
              <textarea
                name="exercise_needs"
                value={formData.exercise_needs}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grooming Requirements
              </label>
              <textarea
                name="grooming"
                value={formData.grooming}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Information
              </label>
              <textarea
                name="training"
                value={formData.training}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shedding Description
              </label>
              <textarea
                name="shedding_description"
                value={formData.shedding_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : (breed ? 'Update Breed' : 'Create Breed')}
        </button>
      </div>
    </form>
  );
}