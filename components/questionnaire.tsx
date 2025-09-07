'use client';

import { useState } from 'react';

export interface QuestionnaireData {
  livingSituation: string;
  activityLevel: string;
  climate: string;
  otherPets: string;
  experienceLevel: string;
  hasKids: string;
  groomingTolerance: string;
}

interface QuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<QuestionnaireData>({
    livingSituation: '',
    activityLevel: '',
    climate: '',
    otherPets: '',
    experienceLevel: '',
    hasKids: '',
    groomingTolerance: ''
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      id: 'livingSituation',
      question: 'What type of home do you live in?',
      options: [
        { value: 'apartment', label: 'Apartment' },
        { value: 'house', label: 'House with yard' },
        { value: 'farm', label: 'Farm/Large property' }
      ]
    },
    {
      id: 'activityLevel',
      question: 'How active are you?',
      options: [
        { value: 'low', label: 'Low - I prefer quiet activities' },
        { value: 'moderate', label: 'Moderate - I enjoy regular walks' },
        { value: 'high', label: 'High - I love hiking and outdoor activities' }
      ]
    },
    {
      id: 'climate',
      question: 'What climate do you live in?',
      options: [
        { value: 'hot', label: 'Hot - Warm weather most of the year' },
        { value: 'moderate', label: 'Moderate - Four seasons' },
        { value: 'cold', label: 'Cold - Cool weather most of the year' }
      ]
    },
    {
      id: 'otherPets',
      question: 'Do you have other pets at home?',
      options: [
        { value: 'none', label: 'No other pets' },
        { value: 'dogs', label: 'I have other dogs' },
        { value: 'cats', label: 'I have cats' },
        { value: 'mixed', label: 'I have various pets' }
      ]
    },
    {
      id: 'experienceLevel',
      question: 'How experienced are you with dogs?',
      options: [
        { value: 'beginner', label: 'First-time dog owner' },
        { value: 'some', label: 'Some experience with dogs' },
        { value: 'expert', label: 'Very experienced dog owner' }
      ]
    },
    {
      id: 'hasKids',
      question: 'Do you have children at home?',
      options: [
        { value: 'none', label: 'No children' },
        { value: 'young', label: 'Young children (under 8)' },
        { value: 'older', label: 'Older children (8+)' },
        { value: 'both', label: 'Children of various ages' }
      ]
    },
    {
      id: 'groomingTolerance',
      question: 'How much grooming are you willing to do?',
      options: [
        { value: 'minimal', label: 'Minimal - Just basic care' },
        { value: 'moderate', label: 'Moderate - Weekly brushing is fine' },
        { value: 'high', label: 'High - I enjoy regular grooming' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-md mx-auto p-6 card bg-white shadow-xl">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-neutral-500 mb-3">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 text-neutral-900">{currentQ.question}</h2>
      
      <div className="space-y-3">
        {currentQ.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(currentQ.id, option.value)}
            className="w-full p-4 text-left border-2 border-neutral-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
          >
            <span className="group-hover:text-blue-700 transition-colors">{option.label}</span>
          </button>
        ))}
      </div>
      
      {currentQuestion > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="text-neutral-500 hover:text-blue-600 transition-colors"
          >
            ← Back to previous question
          </button>
        </div>
      )}
    </div>
  );
}