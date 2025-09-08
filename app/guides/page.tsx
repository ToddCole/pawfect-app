'use client';

import Navigation from "@/components/navigation";
import Link from "next/link";

export default function GuidesPage() {
  const guideCategories = [
    {
      title: "Getting Started",
      description: "Essential information for new dog owners",
      icon: "🏠",
      guides: [
        { title: "Preparing Your Home for a New Dog", link: "#", difficulty: "Beginner" },
        { title: "First Week with Your New Puppy", link: "#", difficulty: "Beginner" },
        { title: "Essential Supplies Checklist", link: "#", difficulty: "Beginner" },
        { title: "Choosing the Right Food", link: "#", difficulty: "Beginner" }
      ]
    },
    {
      title: "Training & Behavior",
      description: "Build a strong bond through proper training",
      icon: "🎓",
      guides: [
        { title: "Basic Obedience Training", link: "#", difficulty: "Beginner" },
        { title: "House Training Guide", link: "#", difficulty: "Beginner" },
        { title: "Socializing Your Dog", link: "#", difficulty: "Intermediate" },
        { title: "Dealing with Separation Anxiety", link: "#", difficulty: "Advanced" }
      ]
    },
    {
      title: "Health & Wellness",
      description: "Keep your furry friend healthy and happy",
      icon: "🏥",
      guides: [
        { title: "Vaccination Schedule", link: "#", difficulty: "Beginner" },
        { title: "Regular Health Checkups", link: "#", difficulty: "Beginner" },
        { title: "Recognizing Signs of Illness", link: "#", difficulty: "Intermediate" },
        { title: "Senior Dog Care", link: "#", difficulty: "Intermediate" }
      ]
    },
    {
      title: "Exercise & Activities",
      description: "Fun ways to keep your dog active and engaged",
      icon: "🎾",
      guides: [
        { title: "Daily Exercise Requirements", link: "#", difficulty: "Beginner" },
        { title: "Indoor Activities for Rainy Days", link: "#", difficulty: "Beginner" },
        { title: "Hiking with Your Dog", link: "#", difficulty: "Intermediate" },
        { title: "Dog Sports and Competitions", link: "#", difficulty: "Advanced" }
      ]
    },
    {
      title: "Grooming & Care",
      description: "Maintain your dog's hygiene and appearance",
      icon: "✂️",
      guides: [
        { title: "Basic Grooming at Home", link: "#", difficulty: "Beginner" },
        { title: "Nail Trimming Guide", link: "#", difficulty: "Beginner" },
        { title: "Brushing Different Coat Types", link: "#", difficulty: "Intermediate" },
        { title: "Professional Grooming Tips", link: "#", difficulty: "Intermediate" }
      ]
    },
    {
      title: "Nutrition & Diet",
      description: "Feed your dog for optimal health",
      icon: "🥗",
      guides: [
        { title: "Understanding Dog Food Labels", link: "#", difficulty: "Beginner" },
        { title: "Feeding Schedules by Age", link: "#", difficulty: "Beginner" },
        { title: "Special Dietary Requirements", link: "#", difficulty: "Intermediate" },
        { title: "Homemade Dog Treats", link: "#", difficulty: "Intermediate" }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-6 shadow-lg">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Dog Care
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
              Guides & Tips
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Comprehensive guides to help you provide the best care for your furry companion, from puppyhood to their golden years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#guides"
              className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold"
            >
              📖 Browse All Guides
            </Link>
            <Link 
              href="/"
              className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold"
            >
              🎯 Take Breed Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">24+</div>
              <div className="text-neutral-600">Expert Guides</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">6</div>
              <div className="text-neutral-600">Care Categories</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">All Levels</div>
              <div className="text-neutral-600">Beginner to Advanced</div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section id="guides" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Complete Care Guides
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need to know about caring for your dog, organized by topic and difficulty level.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {guideCategories.map((category, index) => (
              <div
                key={category.title}
                className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">{category.title}</h3>
                    <p className="text-neutral-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {category.guides.map((guide, guideIndex) => (
                    <div
                      key={guideIndex}
                      className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 group-hover:text-blue-700 transition-colors">
                          {guide.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(guide.difficulty)}`}>
                          {guide.difficulty}
                        </span>
                        <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors group">
                    View all {category.title.toLowerCase()} guides
                    <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Personalized Advice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Take our breed matching quiz to get customized care recommendations for your specific dog.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            🎯 Take the Quiz
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Stay Updated with New Guides
            </h3>
            <p className="text-neutral-600 mb-6">
              Get the latest dog care tips and guides delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button className="btn-primary px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
