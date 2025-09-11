'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import { Breed } from '@/lib/recommendation-engine';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface BreedsPageState {
  breeds: Breed[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedSize: string;
  selectedGroup: string;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export default function BreedManager() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<BreedsPageState>({
    breeds: [],
    loading: true,
    error: null,
    // Deterministic defaults to avoid SSR/CSR mismatch
    searchTerm: '',
    selectedSize: '',
    selectedGroup: '',
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 20,
  });

  // Sync state from URL after mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlSize = searchParams.get('size') || '';
    const urlGroup = searchParams.get('group') || '';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);

    setState(prev => ({
      ...prev,
      searchTerm: urlSearch,
      selectedSize: urlSize,
      selectedGroup: urlGroup,
      currentPage: Number.isNaN(urlPage) ? 1 : urlPage,
    }));
  }, [searchParams]);

  const fetchBreeds = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      let query = supabaseClient
        .from('breeds')
        .select('*', { count: 'exact' });

      if (state.searchTerm) {
        query = query.ilike('name', `%${state.searchTerm}%`);
      }
      if (state.selectedSize) {
        query = query.eq('size', state.selectedSize);
      }
      if (state.selectedGroup) {
        query = query.eq('group', state.selectedGroup);
      }

      const from = (state.currentPage - 1) * state.itemsPerPage;
      const to = from + state.itemsPerPage - 1;
      query = query.range(from, to).order('name');

      const { data, error, count } = await query;
      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / state.itemsPerPage);
      setState(prev => ({
        ...prev,
        breeds: data || [],
        loading: false,
        totalPages,
      }));
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch breeds. Please try again.',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchBreeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searchTerm, state.selectedSize, state.selectedGroup, state.currentPage]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const { error } = await supabaseClient
        .from('breeds')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchBreeds();
    } catch (error) {
      console.error('Error deleting breed:', error);
      alert('Failed to delete breed. Please try again.');
    }
  };

  if (state.loading && state.breeds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛠️ BREED DATABASE MANAGER</h1>
          <p className="text-gray-600">Manage and edit dog breed information</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search breeds</label>
              <input
                type="text"
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value, currentPage: 1 }))}
                placeholder="Enter breed name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <select
                value={state.selectedSize}
                onChange={(e) => setState(prev => ({ ...prev, selectedSize: e.target.value, currentPage: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <select
                value={state.selectedGroup}
                onChange={(e) => setState(prev => ({ ...prev, selectedGroup: e.target.value, currentPage: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All groups</option>
                <option value="Sporting">Sporting</option>
                <option value="Hound">Hound</option>
                <option value="Working">Working</option>
                <option value="Terrier">Terrier</option>
                <option value="Toy">Toy</option>
                <option value="Non-Sporting">Non-Sporting</option>
                <option value="Herding">Herding</option>
              </select>
            </div>

            <div className="flex items-end">
              <Link href="/breed-manager/new" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
                + Add New Breed
              </Link>
            </div>
          </div>
        </div>

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">{state.error}</div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energy Level</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.breeds.map((breed) => (
                <tr key={breed.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {breed.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="h-10 w-10 rounded-full object-cover mr-4" src={breed.image_url} alt={breed.name} />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{breed.name}</div>
                        <div className="text-sm text-gray-500">{breed.origin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{breed.size}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{breed.group}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{breed.energy_level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/breed-manager/edit/${breed.id}`} className="text-orange-600 hover:text-orange-900">Edit</Link>
                    <button onClick={() => handleDelete(breed.id, breed.name)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {state.totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">Page {state.currentPage} of {state.totalPages}</div>
            <div className="space-x-2">
              <button
                onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={state.currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={state.currentPage === state.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}