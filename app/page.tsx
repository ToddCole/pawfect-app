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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navigation onTakeQuiz={() => setShowQuestionnaire(true)} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your
            <span className="text-orange-500 block">Perfect Furry Friend</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover dog breeds that match your lifestyle, living situation, and preferences with our intelligent recommendation engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowQuestionnaire(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              🎯 Take the Quiz Now
            </button>
            <Link 
              href="/breeds"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Browse All Breeds
            </Link>
          </div>
        </div>
        
        {/* Hero Image Placeholder */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-3xl h-96 flex items-center justify-center shadow-2xl">
            <div className="text-center">
              <div className="text-8xl mb-4">🐕‍🦺</div>
              <p className="text-orange-800 text-xl font-semibold">Hero Image Placeholder</p>
              <p className="text-orange-700">Perfect spot for a beautiful dog photo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Pawfect Match?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our intelligent system considers your lifestyle to find breeds that will thrive in your home.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI considers 20+ factors including living space, activity level, and experience to find your perfect match.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Database</h3>
              <p className="text-gray-600">
                Access detailed information on 279+ dog breeds with characteristics, care requirements, and personality traits.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Results</h3>
              <p className="text-gray-600">
                Get match percentages and specific reasons why each breed fits your lifestyle and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Finding your perfect dog breed is just three simple steps away.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take the Quiz</h3>
              <p className="text-gray-600">
                Answer 7 quick questions about your lifestyle, living situation, and preferences.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Matches</h3>
              <p className="text-gray-600">
                Our algorithm analyzes your answers and finds breeds that match your criteria.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Friend</h3>
              <p className="text-gray-600">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Dog Breeds
            </h2>
            <p className="text-xl text-gray-600">
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
              <div key={breed.name} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <div className="text-5xl mb-4">{breed.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{breed.name}</h3>
                <p className="text-sm text-gray-600">{breed.traits}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/breeds"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All 279 Breeds
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Take our quick quiz and discover breeds that will love your lifestyle as much as you'll love them.
          </p>
          <button 
            onClick={() => setShowQuestionnaire(true)}
            className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
          >
            🎯 Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🐾</span>
                <span className="text-xl font-bold">Pawfect Match</span>
              </div>
              <p className="text-gray-300 mb-4">
                Helping families find their perfect canine companions through intelligent breed matching.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setShowQuestionnaire(true)} className="text-gray-300 hover:text-white transition-colors">Take Quiz</button></li>
                <li><Link href="/breeds" className="text-gray-300 hover:text-white transition-colors">Browse Breeds</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-400">
              © 2025 Pawfect Match. Made with ❤️ for dog lovers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
