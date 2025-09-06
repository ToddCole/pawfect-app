'use client';

import { useState, useEffect } from 'react';
import { QuestionnaireData } from './questionnaire';
import { RecommendationEngine, type BreedMatch } from '@/lib/recommendation-engine';
import BreedModal from './breed-modal';
import Navigation from './navigation';

interface ResultsProps {
  answers: QuestionnaireData;
  onBack: () => void;
}

export default function Results({ answers, onBack }: ResultsProps) {
  const [matches, setMatches] = useState<BreedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<BreedMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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