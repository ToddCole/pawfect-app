'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';

export default function TestAuth() {
  const [email, setEmail] = useState('newuser@test.com');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBasicSignup = async () => {
    setLoading(true);
    setResult('🧪 Testing basic signup...');
    
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: 'test123456',
      });
      
      console.log('📊 Signup result:', { data, error });
      
      if (error) {
        setResult(`❌ SIGNUP ERROR:
Message: ${error.message}
Status: ${error.status}
Code: ${error.__isAuthError}
Details: ${JSON.stringify(error, null, 2)}`);
      } else if (data.user) {
        setResult(`✅ SIGNUP SUCCESS:
User ID: ${data.user.id}
Email: ${data.user.email}
Confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}
Created: ${data.user.created_at}`);
      } else {
        setResult('⚠️ Strange: No error but no user returned');
      }
    } catch (err: any) {
      console.error('🚨 Exception during signup:', err);
      setResult(`💥 EXCEPTION: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setResult('🔗 Testing Supabase connection...');
    
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      
      if (error) {
        setResult(`❌ CONNECTION ERROR: ${error.message}`);
      } else {
        setResult(`✅ CONNECTION OK:
URL: ${supabaseClient.supabaseUrl}
Current Session: ${data.session ? 'Logged in' : 'No session'}
User: ${data.session?.user?.email || 'None'}`);
      }
    } catch (err: any) {
      setResult(`💥 CONNECTION FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">🔧 Supabase Auth Debug Tool</h1>
        <p className="text-gray-600 mb-8">Diagnosing the 500 signup error</p>
        
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Test Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="test@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">Use a new email that doesn't exist in your system</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '⏳ Testing...' : '🔗 Test Connection'}
            </button>
            
            <button
              onClick={testBasicSignup}
              disabled={loading || !email}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '⏳ Testing...' : '🧪 Test Signup (This Will Fail)'}
            </button>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-bold text-lg mb-3">📋 Test Results:</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                {result || '👆 Click a button above to run tests'}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-800 mb-3">🎯 Next Steps Based on Results:</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>If Connection fails:</strong> Check .env.local file and Supabase project exists</p>
            <p><strong>If Signup shows 500 error:</strong> Issue is in Supabase project configuration</p>
            <p><strong>If Signup works here but not in main app:</strong> Issue is in our auth page code</p>
          </div>
        </div>
      </div>
    </div>
  );
}