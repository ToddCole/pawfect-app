'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';

export default function DebugUpdatePage() {
  const [breedId, setBreedId] = useState('794d5dee-e43b-4173-a6de-f188790aca96'); // American Foxhound
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testUpdate = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Simple update test
      const updateData = {
        description: 'Updated description at ' + new Date().toLocaleTimeString(),
        last_updated: {
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        }
      };

      console.log('Testing update with ID:', breedId);
      console.log('Update data:', updateData);

      const result = await supabaseClient
        .from('breeds')
        .update(updateData)
        .eq('id', breedId)
        .select()
        .single();

      console.log('Full result:', result);
      console.log('Error:', result.error);
      console.log('Data:', result.data);

      if (result.error) {
        setResult(`❌ Error: ${JSON.stringify(result.error, null, 2)}`);
      } else {
        setResult(`✅ Success! Updated breed: ${result.data?.name}`);
      }

    } catch (error: any) {
      console.error('Caught error:', error);
      setResult(`❌ Exception: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (error) {
        setResult(`❌ Auth Error: ${error.message}`);
      } else if (user) {
        setResult(`✅ Authenticated as: ${user.email}`);
      } else {
        setResult(`❌ Not authenticated`);
      }
    } catch (error: any) {
      setResult(`❌ Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRead = async () => {
    setLoading(true);
    try {
      const result = await supabaseClient
        .from('breeds')
        .select('id, name, description')
        .eq('id', breedId)
        .single();

      if (result.error) {
        setResult(`❌ Read Error: ${JSON.stringify(result.error, null, 2)}`);
      } else {
        setResult(`✅ Read Success: ${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (error: any) {
      setResult(`❌ Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testListBreeds = async () => {
    setLoading(true);
    try {
      const result = await supabaseClient
        .from('breeds')
        .select('id, name')
        .limit(5);

      if (result.error) {
        setResult(`❌ List Error: ${JSON.stringify(result.error, null, 2)}`);
      } else {
        setResult(`✅ Found ${result.data?.length} breeds:\n${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (error: any) {
      setResult(`❌ Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🛠️ Debug Update Issues</h1>
      
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed ID</label>
          <input
            type="text"
            value={breedId}
            onChange={(e) => setBreedId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter breed ID to test"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={testAuth}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Test Auth
          </button>
          
          <button
            onClick={testListBreeds}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
          >
            List Breeds
          </button>
          
          <button
            onClick={testRead}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            Test Read
          </button>
          
          <button
            onClick={testUpdate}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            Test Update
          </button>
        </div>

        {result && (
          <div className="p-3 bg-gray-50 rounded-md">
            <pre className="text-xs whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-900">Instructions:</h3>
        <ol className="text-sm text-yellow-800 space-y-1 mt-2">
          <li>1. Click "Test Auth" to verify you're authenticated</li>
          <li>2. Click "Test Read" to make sure the breed exists</li>
          <li>3. Click "Test Update" to see the exact error</li>
          <li>4. Check the browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
}