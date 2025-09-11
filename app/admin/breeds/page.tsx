'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import { Breed } from '@/lib/recommendation-engine';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function BreedsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<BreedsPageState>({
    breeds: [],
    loading: true,
    error: null,
    searchTerm: searchParams.get('search') || '',
    selectedSize: searchParams.get('size') || '',
    selectedGroup: searchParams.get('group') || '',
    currentPage: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    itemsPerPage: 20
  });

  const fetchBreeds = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      let query = supabaseClient
        .from('breeds')
        .select('*', { count: 'exact' });

      // Apply filters
      if (state.searchTerm) {
        query = query.ilike('name', `%${state.searchTerm}%`);
      }

      if (state.selectedSize) {
        query = query.eq('size', state.selectedSize);
      }

      if (state.selectedGroup) {
        query = query.eq('"group"', state.selectedGroup);
      }

      // Special filter for missing images
      if (searchParams.get('filter') === 'missing-images') {
        query = query.or('image_url.is.null,image_url.eq.""');
      }

      // Apply pagination
      const from = (state.currentPage - 1) * state.itemsPerPage;
      const to = from + state.itemsPerPage - 1;

      const { data: breeds, error, count } = await query
        .range(from, to)
        .order('name');

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / state.itemsPerPage);

      setState(prev => ({
        ...prev,
        breeds: breeds || [],
        loading: false,
        totalPages
      }));
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load breeds',
        loading: false
      }));
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, [state.searchTerm, state.selectedSize, state.selectedGroup, state.currentPage]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('breeds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh the list
      fetchBreeds();
    } catch (error) {
      console.error('Error deleting breed:', error);
      alert('Failed to delete breed. Please try again.');
    }
  };

  const updateURL = (updates: Partial<Pick<BreedsPageState, 'searchTerm' | 'selectedSize' | 'selectedGroup' | 'currentPage'>>) => {
    const params = new URLSearchParams();
    
    const newState = { ...state, ...updates };
    
    if (newState.searchTerm) params.set('search', newState.searchTerm);
    if (newState.selectedSize) params.set('size', newState.selectedSize);
    if (newState.selectedGroup) params.set('group', newState.selectedGroup);
    if (newState.currentPage > 1) params.set('page', newState.currentPage.toString());

    const url = `/admin/breeds${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url, { scroll: false });

    setState(prev => ({ ...prev, ...updates }));
  };

  const uniqueSizes = [...new Set(state.breeds.map(b => b.size).filter(Boolean))];
  const uniqueGroups = [...new Set(state.breeds.map(b => b.group).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Breeds</h1>
          <p className="text-gray-600">
            {state.breeds.length} breed{state.breeds.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link
          href="/admin/breeds/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Breed
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={state.searchTerm}
              onChange={(e) => updateURL({ searchTerm: e.target.value, currentPage: 1 })}
              placeholder="Search breed names..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={state.selectedSize}
              onChange={(e) => updateURL({ selectedSize: e.target.value, currentPage: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Sizes</option>
              {uniqueSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <select
              value={state.selectedGroup}
              onChange={(e) => updateURL({ selectedGroup: e.target.value, currentPage: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Groups</option>
              {uniqueGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => updateURL({ searchTerm: '', selectedSize: '', selectedGroup: '', currentPage: 1 })}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Breeds Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {state.loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading breeds...</p>
          </div>
        ) : state.error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{state.error}</p>
            <button
              onClick={fetchBreeds}
              className="mt-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : state.breeds.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No breeds found</p>
            <Link
              href="/admin/breeds/new"
              className="mt-2 inline-block text-orange-500 hover:text-orange-600 font-medium"
            >
              Add the first breed
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Breed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size & Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.breeds.map((breed) => (
                  <tr key={breed.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{breed.name}</div>
                        <div className="text-sm text-gray-500">
                          {breed.origin}
                          {breed.popularity_rank && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              #{breed.popularity_rank}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{breed.size}</div>
                      <div className="text-sm text-gray-500">{breed.group}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {breed.weight_min && breed.weight_max && (
                          <div>{breed.weight_min}-{breed.weight_max} kg</div>
                        )}
                        {breed.lifespan && (
                          <div className="text-gray-500">{breed.lifespan}</div>
                        )}
                        {breed.monthly_cost_aud && (
                          <div className="text-green-600">${breed.monthly_cost_aud} AUD/month</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {breed.image_url ? (
                        <img
                          src={breed.image_url}
                          alt={breed.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/breeds/${breed.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(breed.id, breed.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {state.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {state.currentPage} of {state.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => updateURL({ currentPage: state.currentPage - 1 })}
              disabled={state.currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => updateURL({ currentPage: state.currentPage + 1 })}
              disabled={state.currentPage === state.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}