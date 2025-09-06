'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  onTakeQuiz?: () => void;
  showQuizButton?: boolean;
}

export default function Navigation({ onTakeQuiz, showQuizButton = true }: NavigationProps) {
  const router = useRouter();

  const handleTakeQuiz = () => {
    if (onTakeQuiz) {
      onTakeQuiz();
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-2xl font-bold text-gray-900">Pawfect Match</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {showQuizButton && (
              <button 
                onClick={handleTakeQuiz}
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Take Quiz
              </button>
            )}
            <Link href="/breeds" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Browse Breeds
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/auth" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Sign In
            </Link>
          </div>
          
          <div className="md:hidden">
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}