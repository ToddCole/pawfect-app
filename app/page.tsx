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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 animate-bounce">
            <span className="text-6xl">🐾</span>
          </div>
          <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
            <span className="text-4xl">🦴</span>
          </div>
          <div className="absolute bottom-40 left-1/4 animate-bounce" style={{ animationDelay: '2s' }}>
            <span className="text-5xl">🎾</span>
          </div>
          <div className="absolute top-32 right-1/3 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <span className="text-3xl">🐕</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your
              <span className="text-orange-500 block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Perfect Furry Friend
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-6 rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Discover dog breeds that match your lifestyle, living situation, and preferences with our 
            <span className="text-orange-600 font-semibold"> intelligent recommendation engine</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button 
              onClick={() => setShowQuestionnaire(true)}
              className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
            >
              <span className="flex items-center justify-center gap-3">
                🎯 Take the Quiz Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            <Link 
              href="/breeds"
              className="group border-3 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-lg hover:shadow-orange-500/25"
            >
              <span className="flex items-center justify-center gap-3">
                Browse All Breeds
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
        
        {/* Enhanced Hero Visual */}
        <div className="max-w-6xl mx-auto mt-8 relative">
          <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-white rounded-3xl p-12 shadow-2xl border border-orange-100">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 rounded-full opacity-80"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-300 rounded-full opacity-60"></div>
            <div className="absolute -bottom-3 left-1/4 w-5 h-5 bg-orange-500 rounded-full opacity-70"></div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🐕‍🦺</div>
                <h3 className="text-lg font-bold text-gray-800">Smart Matching</h3>
                <p className="text-gray-600 text-sm">AI-powered recommendations</p>
              </div>
              
              <div className="text-center">
                <div className="text-8xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-orange-600 mb-2">Find Your Perfect Match</h3>
                <p className="text-gray-700">Connect with breeds that fit your lifestyle and living situation perfectly</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse" style={{ animationDelay: '1s' }}>❤️</div>
                <h3 className="text-lg font-bold text-gray-800">Lifetime Companion</h3>
                <p className="text-gray-600 text-sm">Built for lasting bonds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
              ✨ Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose 
              <span className="text-orange-500"> Pawfect Match</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our intelligent system considers your lifestyle to find breeds that will thrive in your home and bring you years of joy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">🧠</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-200 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI considers <span className="text-orange-600 font-semibold">20+ factors</span> including living space, activity level, and experience to find your perfect match.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">📊</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-200 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Database</h3>
              <p className="text-gray-600 leading-relaxed">
                Access detailed information on <span className="text-orange-600 font-semibold">279+ dog breeds</span> with characteristics, care requirements, and personality traits.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">💝</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-200 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Get <span className="text-orange-600 font-semibold">match percentages</span> and specific reasons why each breed fits your lifestyle and preferences.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 via-orange-25 to-orange-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">🐾</div>
          <div className="absolute top-32 right-20 text-4xl">🎾</div>
          <div className="absolute bottom-20 left-1/4 text-5xl">🦴</div>
          <div className="absolute bottom-32 right-1/3 text-3xl">🐕</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white text-orange-800 rounded-full text-sm font-semibold mb-4 shadow-md">
              🚀 Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Finding your perfect dog breed is just <span className="text-orange-600 font-semibold">three simple steps</span> away.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-orange-300 to-orange-400 transform -translate-y-1/2 z-0"></div>
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-orange-300 to-orange-400 transform -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="text-5xl mb-6 mt-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Take the Quiz</h3>
                <p className="text-gray-600 leading-relaxed">
                  Answer <span className="text-orange-600 font-semibold">7 quick questions</span> about your lifestyle, living situation, and preferences.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="text-5xl mb-6 mt-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Matches</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our <span className="text-orange-600 font-semibold">intelligent algorithm</span> analyzes your answers and finds breeds that match your criteria.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="text-5xl mb-6 mt-4">❤️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Your Friend</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore <span className="text-orange-600 font-semibold">detailed breed information</span> and find your perfect canine companion.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Breeds Preview */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
              🌟 Most Loved
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Popular Dog Breeds
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore some of the most beloved breeds in our database.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { name: 'Golden Retriever', emoji: '🦮', traits: 'Friendly, Intelligent, Devoted', gradient: 'from-yellow-400 to-orange-500' },
              { name: 'French Bulldog', emoji: '🐕', traits: 'Adaptable, Playful, Smart', gradient: 'from-blue-400 to-purple-500' },
              { name: 'Labrador', emoji: '🐕‍🦺', traits: 'Outgoing, Active, Loyal', gradient: 'from-green-400 to-blue-500' },
              { name: 'German Shepherd', emoji: '🐺', traits: 'Confident, Courageous, Smart', gradient: 'from-gray-400 to-gray-600' }
            ].map((breed, index) => (
              <div 
                key={breed.name} 
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${breed.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-3xl">{breed.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {breed.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{breed.traits}</p>
                <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/breeds"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-orange-500/25"
            >
              View All 279 Breeds
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-bounce">🐾</div>
          <div className="absolute top-20 right-20 text-6xl animate-bounce" style={{ animationDelay: '1s' }}>❤️</div>
          <div className="absolute bottom-20 left-1/4 text-7xl animate-bounce" style={{ animationDelay: '2s' }}>🎾</div>
          <div className="absolute bottom-10 right-1/3 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🦴</div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Find Your 
              <span className="block text-orange-100">Perfect Match?</span>
            </h2>
            <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Take our quick quiz and discover breeds that will love your lifestyle as much as you'll love them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowQuestionnaire(true)}
                className="group bg-white text-orange-600 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-white/25"
              >
                <span className="flex items-center justify-center gap-3">
                  🎯 Start Your Journey
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">279+</div>
                <div className="text-orange-200 text-sm">Dog Breeds</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">20+</div>
                <div className="text-orange-200 text-sm">Matching Factors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">7</div>
                <div className="text-orange-200 text-sm">Quick Questions</div>
              </div>
            </div>
          </div>
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
