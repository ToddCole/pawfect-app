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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">{currentQ.question}</h2>
      
      <div className="space-y-3">
        {currentQ.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(currentQ.id, option.value)}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-500 transition-all duration-200"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}