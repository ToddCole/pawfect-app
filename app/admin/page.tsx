'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import Link from 'next/link';

interface DashboardStats {
  totalBreeds: number;
  recentlyUpdated: number;
  missingImages: number;
  popularBreeds: Array<{
    id: string;
    name: string;
    popularity_rank: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total breeds count
        const { count: totalBreeds } = await supabaseClient
          .from('breeds')
          .select('*', { count: 'exact', head: true });

        // Get breeds with missing images
        const { count: missingImages } = await supabaseClient
          .from('breeds')
          .select('*', { count: 'exact', head: true })
          .or('image_url.is.null,image_url.eq.""');

        // Get recently updated breeds (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: recentlyUpdated } = await supabaseClient
          .from('breeds')
          .select('*', { count: 'exact', head: true })
          .gte('last_updated->>updated_at', sevenDaysAgo.toISOString().split('T')[0]);

        // Get popular breeds (lowest popularity rank numbers)
        const { data: popularBreeds } = await supabaseClient
          .from('breeds')
          .select('id, name, popularity_rank')
          .not('popularity_rank', 'is', null)
          .order('popularity_rank', { ascending: true })
          .limit(5);

        setStats({
          totalBreeds: totalBreeds || 0,
          recentlyUpdated: recentlyUpdated || 0,
          missingImages: missingImages || 0,
          popularBreeds: popularBreeds || []
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Pawfect Match dog breed database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Breeds</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBreeds}</p>
            </div>
            <div className="text-3xl">🐕</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Recently Updated</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.recentlyUpdated}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Missing Images</p>
              <p className="text-2xl font-bold text-red-600">{stats?.missingImages}</p>
            </div>
            <div className="text-3xl">📷</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Popular Breeds</p>
              <p className="text-2xl font-bold text-green-600">{stats?.popularBreeds?.length}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Breed Management Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">🐕 Dog Breed Management</h2>
          <p className="text-gray-600 mt-1">Add, edit, and manage dog breed information</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/breeds"
              className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl text-center font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-blue-300"
            >
              <div className="text-4xl mb-3">🛠️</div>
              <div className="text-xl font-bold mb-2">🔥 BREED DATABASE MANAGER 🔥</div>
              <div className="text-base font-semibold opacity-95">Click here to edit breeds!</div>
            </Link>
            <Link
              href="/admin/breeds/new"
              className="group bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl text-center font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-3">➕</div>
              <div className="text-lg font-semibold mb-2">Add New Breed</div>
              <div className="text-sm opacity-90">Create a new dog breed entry</div>
            </Link>
            <Link
              href="/admin/breeds?filter=missing-images"
              className="group bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl text-center font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-3">📷</div>
              <div className="text-lg font-semibold mb-2">Fix Missing Images</div>
              <div className="text-sm opacity-90">Update breeds without photos</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Breeds */}
      {stats?.popularBreeds && stats.popularBreeds.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Most Popular Breeds</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.popularBreeds.map((breed, index) => (
                <div key={breed.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      #{breed.popularity_rank}
                    </span>
                    <span className="font-medium text-gray-900">{breed.name}</span>
                  </div>
                  <Link
                    href={`/admin/breeds/${breed.id}`}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}