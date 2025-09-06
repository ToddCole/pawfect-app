'use client';

import { useEffect } from 'react';
import { BreedMatch } from '@/lib/recommendation-engine';

interface BreedModalProps {
  breed: BreedMatch | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BreedModal({ breed, isOpen, onClose }: BreedModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !breed) return null;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{breed.name}</h2>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              breed.matchPercentage >= 90 
                ? 'bg-green-100 text-green-800'
                : breed.matchPercentage >= 75
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {breed.matchPercentage}% Match
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              {breed.image_url ? (
                <img 
                  src={breed.image_url} 
                  alt={breed.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                  }}
                />
              ) : (
                <span className="text-6xl">🐕</span>
              )}
            </div>

            {/* Quick Facts */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Facts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{breed.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group:</span>
                    <span className="font-medium">{breed.group}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-medium">{breed.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{breed.weight_min}-{breed.weight_max} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{breed.height_min}-{breed.height_max} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lifespan:</span>
                    <span className="font-medium">{breed.lifespan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Cost:</span>
                    <span className="font-medium">${breed.monthly_cost_aud} AUD</span>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              {breed.matchReasons.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Why This is a Great Match</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {breed.matchReasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Breed</h3>
            <p className="text-gray-700 leading-relaxed">{breed.description}</p>
          </div>

          {/* Temperament */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Temperament</h3>
            <p className="text-gray-700">{breed.temperament}</p>
          </div>

          {/* Characteristics Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Characteristics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Energy Level', value: breed.energy_level, max: 5 },
                { label: 'Good with Kids', value: breed.good_with_kids, max: 5 },
                { label: 'Training Ease', value: breed.training_ease, max: 5 },
                { label: 'Grooming Needs', value: breed.grooming_needs, max: 5 },
                { label: 'Barking Level', value: breed.barking_level, max: 5 },
                { label: 'Shedding Level', value: breed.shedding_level, max: 5 },
                { label: 'Apartment Friendly', value: breed.apartment_friendly, max: 5 },
                { label: 'Good with Pets', value: breed.good_with_pets, max: 5 },
                { label: 'Drooling Tendency', value: breed.drooling_tendency, max: 5 },
                { label: 'Separation Anxiety Risk', value: breed.separation_anxiety_risk, max: 5 },
                { label: 'Climate Suitability', value: breed.climate_suitability, max: 5 },
                { label: 'Noise Sensitivity', value: breed.noise_sensitivity, max: 5 },
              ].map((char) => (
                <div key={char.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{char.label}:</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${getRatingBg(char.value)}`}
                        style={{ width: `${(char.value / char.max) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getRatingColor(char.value)}`}>
                      {char.value}/{char.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Care Requirements */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exercise Needs</h3>
              <p className="text-gray-700 text-sm">{breed.exercise_needs}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Grooming</h3>
              <p className="text-gray-700 text-sm">{breed.grooming}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Training</h3>
              <p className="text-gray-700 text-sm">{breed.training}</p>
            </div>
            {breed.shedding_description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shedding Info</h3>
                <p className="text-gray-700 text-sm">{breed.shedding_description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Breed type: {breed.breed_type}
              {breed.popularity_rank && ` • Popularity rank: #${breed.popularity_rank}`}
            </div>
            <button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}