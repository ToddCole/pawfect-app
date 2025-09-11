'use client';

import { useState, useEffect } from 'react';
import { QuestionnaireData } from './questionnaire';
import { RecommendationEngine, type BreedMatch } from '@/lib/recommendation-engine';
import BreedModal from './breed-modal';
import Navigation from './navigation';
import { supabaseClient } from '@/lib/supabase-client';
import { v4 as uuidv4 } from 'uuid';

interface ResultsProps {
  answers: QuestionnaireData;
  onBack: () => void;
  user?: any;
  showAuthPrompt?: () => void;
}

export default function Results({ answers, onBack, user, showAuthPrompt }: ResultsProps) {
  const [matches, setMatches] = useState<BreedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<BreedMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'guest-saved' | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setMatches(data.matches);
          // Save results after getting matches
          saveQuizResults(answers, data.matches);
        } else {
          throw new Error(data.error || 'Failed to get recommendations');
        }

      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [answers]);

  // Generate session ID on component mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, []);

  const saveQuizResults = async (answers: QuestionnaireData, matches: BreedMatch[]) => {
    try {
      setSaveStatus('saving');

      const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          matches,
          sessionId: sessionId || uuidv4()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus(user ? 'saved' : 'guest-saved');
        if (!user && data.sessionId) {
          setSessionId(data.sessionId);
          // Store session ID in localStorage for guest users
          localStorage.setItem('pawfect_session_id', data.sessionId);
        }
      } else {
        console.error('Failed to save quiz results:', data.error);
      }

    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const handleLearnMore = (breed: BreedMatch) => {
    setSelectedBreed(breed);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBreed(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Finding your perfect breed matches...</h2>
          <p className="text-gray-600 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navigation showQuizButton={false} />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Your Perfect Breed Matches</h1>
          <p className="text-gray-600">Based on your lifestyle and preferences</p>
          <button
            onClick={onBack}
            className="mt-4 text-orange-600 hover:text-orange-700 underline"
          >
            ← Take Quiz Again
          </button>
          
          {/* Save Status */}
          {saveStatus && (
            <div className="mt-4">
              {saveStatus === 'saving' && (
                <div className="inline-flex items-center text-sm text-gray-600">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving your results...
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="inline-flex items-center text-sm text-green-600">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Results saved to your account
                </div>
              )}
              {saveStatus === 'guest-saved' && !user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-blue-800">
                        Results saved temporarily. Create an account to save them permanently!
                      </span>
                    </div>
                    <button
                      onClick={showAuthPrompt}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((breed) => (
          <div
            key={breed.id}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
          >
            {/* Match Percentage Badge */}
            <div className="flex justify-between items-start mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                breed.matchPercentage >= 90 
                  ? 'bg-green-100 text-green-800'
                  : breed.matchPercentage >= 75
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {breed.matchPercentage}% Match
              </div>
              <div className={`text-sm font-medium ${RecommendationEngine.getMatchColor(breed.matchPercentage)}`}>
                {RecommendationEngine.getMatchLabel(breed.matchPercentage)}
              </div>
            </div>

            {/* Breed Image Placeholder */}
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              {breed.image_url ? (
                <img 
                  src={breed.image_url} 
                  alt={breed.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/placeholder/300/200';
                  }}
                />
              ) : (
                <span className="text-4xl">🐕</span>
              )}
            </div>

            {/* Breed Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{breed.name}</h3>
                <p className="text-sm text-gray-600">{breed.size} • {breed.group}</p>
              </div>

              {/* Key Characteristics */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energy Level:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${((breed.energy_level || 0) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{breed.energy_level}/5</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Good with Kids:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${((breed.good_with_kids || 0) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{breed.good_with_kids}/5</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Training Ease:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${((breed.training_ease || 0) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{breed.training_ease}/5</span>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              {breed.matchReasons.length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Why this is a good match:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {breed.matchReasons.slice(0, 3).map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={() => handleLearnMore(breed)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors mt-4"
              >
                Learn More About {breed.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No breed matches found. Please try adjusting your preferences.</p>
        </div>
      )}

      {/* Breed Modal */}
        <BreedModal
          breed={selectedBreed}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}