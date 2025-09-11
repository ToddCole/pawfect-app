'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import AuthModal from '@/components/auth-modal';
import { useAuth } from '@/contexts/auth-context';

interface QuizResult {
  id: string;
  answers: any;
  matches: any[];
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, isAdmin, loading: authLoading, initialized, signOut } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state until auth is initialized
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        window.location.href = '/auth?redirect=/dashboard';
        return;
      }
      
      // Fetch user's quiz results
      try {
        const response = await fetch('/api/quiz-results');
        const data = await response.json();
        
        if (data.success) {
          setResults(data.results);
        } else {
          setError('Failed to load your quiz results');
        }
      } catch (err) {
        setError('Failed to load your quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          showQuizButton={false} 
          user={user}
          isAdmin={isAdmin}
          onSignIn={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
        />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showQuizButton={false} 
        user={user}
        isAdmin={isAdmin}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.user_metadata?.full_name || user?.email}!
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Quiz Results</h2>
              <Link
                href="/"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Take New Quiz
              </Link>
            </div>
          </div>

          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🐕</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz results yet</h3>
                <p className="text-gray-600 mb-4">
                  Take our breed recommendation quiz to see your perfect matches!
                </p>
                <Link
                  href="/"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Take Quiz Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Quiz taken on {new Date(result.created_at).toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.matches.length} breeds matched
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(result.created_at).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Your Top Matches:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {result.matches.slice(0, 3).map((match: any, index: number) => (
                          <div key={match.id} className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="font-medium text-gray-900">{match.name}</div>
                            <div className="text-sm text-gray-600">{match.matchPercentage}% match</div>
                            <div className="text-xs text-gray-500">{match.size}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <strong>Your preferences:</strong>{' '}
                      {result.answers.livingSituation} • {result.answers.activityLevel} activity •{' '}
                      {result.answers.hasKids !== 'none' ? 'has kids' : 'no kids'} •{' '}
                      {result.answers.groomingTolerance} grooming tolerance
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}