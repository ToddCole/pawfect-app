'use client';

import Navigation from "@/components/navigation";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Veterinary Consultant",
      image: "👩‍⚕️",
      description: "15+ years of veterinary experience specializing in canine health and behavior."
    },
    {
      name: "Mike Chen",
      role: "Dog Trainer & Behaviorist",
      image: "🧑‍🏫",
      description: "Certified professional dog trainer with expertise in positive reinforcement methods."
    },
    {
      name: "Emily Rodriguez",
      role: "Breed Research Specialist",
      image: "👩‍🔬",
      description: "Canine genetics researcher with deep knowledge of breed characteristics and traits."
    }
  ];

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Matching",
      description: "Our advanced algorithm considers 20+ factors to find breeds that truly match your lifestyle."
    },
    {
      icon: "📊",
      title: "Comprehensive Database",
      description: "Detailed information on 279+ dog breeds with verified characteristics and care requirements."
    },
    {
      icon: "🎯",
      title: "Personalized Results",
      description: "Get specific match percentages and detailed explanations for why each breed fits your needs."
    },
    {
      icon: "📚",
      title: "Expert Guides",
      description: "Access to comprehensive care guides written by veterinarians and certified trainers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-6 shadow-lg">
            <span className="text-2xl">❤️</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            About
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
              Pawfect Match
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            We're passionate about helping families find their perfect canine companions through intelligent breed matching and expert guidance.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Every dog deserves a loving home, and every family deserves a dog that fits their lifestyle. Too often, mismatched adoptions lead to stress for both dogs and families, sometimes resulting in returns to shelters.
              </p>
              <p className="text-lg text-neutral-600 mb-6">
                Pawfect Match was created to solve this problem by using intelligent matching technology that considers your living situation, activity level, experience, and preferences to recommend breeds that will truly thrive in your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/"
                  className="btn-primary inline-flex items-center justify-center px-6 py-3"
                >
                  🎯 Take Our Quiz
                </Link>
                <Link 
                  href="/guides"
                  className="btn-secondary inline-flex items-center justify-center px-6 py-3"
                >
                  📚 Read Our Guides
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl h-96 flex items-center justify-center shadow-xl">
              <div className="text-center">
                <div className="text-8xl mb-4">🐕‍🦺</div>
                <p className="text-blue-800 text-xl font-semibold">Happy Dogs</p>
                <p className="text-blue-700">Happy Families</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with expert knowledge to provide the most accurate breed recommendations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our recommendations are backed by veterinarians, certified trainers, and canine behavior specialists.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">{member.image}</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-neutral-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">279+</div>
              <div className="text-blue-100">Dog Breeds</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Happy Matches</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24+</div>
              <div className="text-blue-100">Care Guides</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Match Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Join thousands of families who have found their ideal canine companions through Pawfect Match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold"
            >
              🎯 Start Your Journey
            </Link>
            <Link 
              href="/breeds"
              className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold"
            >
              🔍 Browse All Breeds
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                Have Questions or Feedback?
              </h3>
              <p className="text-neutral-600">
                We'd love to hear from you! Reach out to our team for support or suggestions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📧</span>
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Email</h4>
                <p className="text-neutral-600">support@pawfectmatch.com</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">💬</span>
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Chat</h4>
                <p className="text-neutral-600">Live chat available 9-5 PST</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🐾</span>
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Social</h4>
                <p className="text-neutral-600">Follow @PawfectMatch</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
