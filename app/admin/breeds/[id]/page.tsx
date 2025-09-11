'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase-client';
import { Breed } from '@/lib/recommendation-engine';
import BreedForm from '@/components/admin/breed-form';

export default function EditBreedPage() {
  const params = useParams();
  const [breed, setBreed] = useState<Breed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('breeds')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        
        setBreed(data);
      } catch (error: any) {
        console.error('Error fetching breed:', error);
        setError('Failed to load breed');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBreed();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !breed) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Breed</h1>
          <p className="text-red-600">{error || 'Breed not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Breed</h1>
        <p className="text-gray-600">Editing {breed.name}</p>
      </div>
      
      <BreedForm breed={breed} />
    </div>
  );
}