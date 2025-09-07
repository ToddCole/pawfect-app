'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavigationProps {
  onTakeQuiz?: () => void;
  showQuizButton?: boolean;
}

export default function Navigation({ onTakeQuiz, showQuizButton = true }: NavigationProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTakeQuiz = () => {
    if (onTakeQuiz) {
      onTakeQuiz();
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-xl">🐾</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Pawfect Match
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {showQuizButton && (
              <button 
                onClick={handleTakeQuiz}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 relative group"
              >
                Take Quiz
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </button>
            )}
            <Link 
              href="/breeds" 
              className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Browse Breeds
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/auth" 
              className="btn-primary inline-flex items-center px-6 py-2.5 text-sm font-semibold"
            >
              Sign In
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-700 hover:text-blue-600 p-2 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {showQuizButton && (
                <button 
                  onClick={() => {
                    handleTakeQuiz();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 text-left px-2"
                >
                  Take Quiz
                </button>
              )}
              <Link 
                href="/breeds" 
                className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200 px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Breeds
              </Link>
              <Link 
                href="/about" 
                className="text-neutral-700 hover:text-blue-600 font-medium transition-colors duration-200 px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/auth" 
                className="btn-primary inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold mx-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}