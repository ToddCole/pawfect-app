'use client';

import Link from "next/link";
import Questionnaire, { QuestionnaireData } from "@/components/questionnaire";
import Results from "@/components/results";
import Navigation from "@/components/navigation";
import { useState } from "react";

export default function Home() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [results, setResults] = useState<QuestionnaireData | null>(null);

  const handleQuestionnaireComplete = (data: QuestionnaireData) => {
    setResults(data);
    setShowQuestionnaire(false);
  };

  const handleBackToHome = () => {
    setResults(null);
    setShowQuestionnaire(false);
  };

  if (showQuestionnaire) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation showQuizButton={false} />
        <main className="py-12">
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        </main>
      </div>
    );
  }

  if (results) {
    return (
      <Results answers={results} onBack={handleBackToHome} />
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation onTakeQuiz={() => setShowQuestionnaire(true)} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Find Your
            <span className="text-gradient block">Perfect Furry Friend</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover dog breeds that match your lifestyle, living situation, and preferences with our intelligent recommendation engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowQuestionnaire(true)}
              className="btn-primary px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              🎯 Take the Quiz Now
            </button>
            <Link 
              href="/breeds"
              className="btn-secondary px-8 py-4 text-lg font-semibold"
            >
              Browse All Breeds
            </Link>
          </div>
        </div>
        
        {/* Hero Image Placeholder - Modern Design */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="card p-8 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 h-96 flex items-center justify-center shadow-2xl">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-bounce">🐕‍🦺</div>
              <p className="text-blue-800 text-xl font-semibold">Hero Image Placeholder</p>
              <p className="text-blue-700">Perfect spot for a beautiful dog photo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Pawfect Match?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our intelligent system considers your lifestyle to find breeds that will thrive in your home.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Smart Matching</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our AI considers 20+ factors including living space, activity level, and experience to find your perfect match.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Comprehensive Database</h3>
              <p className="text-neutral-600 leading-relaxed">
                Access detailed information on 279+ dog breeds with characteristics, care requirements, and personality traits.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Personalized Results</h3>
              <p className="text-neutral-600 leading-relaxed">
                Get match percentages and specific reasons why each breed fits your lifestyle and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600">
              Finding your perfect dog breed is just three simple steps away.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center relative hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                1
              </div>
              <div className="text-5xl mb-6 mt-4">📝</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Take the Quiz</h3>
              <p className="text-neutral-600 leading-relaxed">
                Answer 7 quick questions about your lifestyle, living situation, and preferences.
              </p>
            </div>
            
            <div className="card p-8 text-center relative hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                2
              </div>
              <div className="text-5xl mb-6 mt-4">🔍</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Get Matches</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our algorithm analyzes your answers and finds breeds that match your criteria.
              </p>
            </div>
            
            <div className="card p-8 text-center relative hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                3
              </div>
              <div className="text-5xl mb-6 mt-4">❤️</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Find Your Friend</h3>
              <p className="text-neutral-600 leading-relaxed">
                Explore detailed breed information and find your perfect canine companion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Breeds Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Popular Dog Breeds
            </h2>
            <p className="text-xl text-neutral-600">
              Explore some of the most beloved breeds in our database.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { name: 'Golden Retriever', emoji: '🦮', traits: 'Friendly, Intelligent, Devoted' },
              { name: 'French Bulldog', emoji: '🐕', traits: 'Adaptable, Playful, Smart' },
              { name: 'Labrador', emoji: '🐕‍🦺', traits: 'Outgoing, Active, Loyal' },
              { name: 'German Shepherd', emoji: '🐺', traits: 'Confident, Courageous, Smart' }
            ].map((breed) => (
              <div key={breed.name} className="card p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{breed.emoji}</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{breed.name}</h3>
                <p className="text-sm text-neutral-600">{breed.traits}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/breeds"
              className="btn-primary px-8 py-3 font-semibold"
            >
              View All 279 Breeds
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-blue-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Take our quick quiz and discover breeds that will love your lifestyle as much as you'll love them.
          </p>
          <button 
            onClick={() => setShowQuestionnaire(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            🎯 Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
}
