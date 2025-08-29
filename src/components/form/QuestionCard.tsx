'use client';

import { ReactNode } from 'react';

interface QuestionCardProps {
  question: string;
  category?: string;
  questionNumber?: number;
  totalQuestions?: number;
  children: ReactNode;
  className?: string;
}

export default function QuestionCard({
  question,
  category,
  questionNumber,
  totalQuestions,
  children,
  className = ''
}: QuestionCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        {category && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {category}
            </span>
          </div>
        )}
        
        {questionNumber && totalQuestions && (
          <div className="text-sm text-gray-500 mb-2">
            Pergunta {questionNumber} de {totalQuestions}
          </div>
        )}
        
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question}
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
