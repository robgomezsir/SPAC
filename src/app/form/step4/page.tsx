'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';

interface FinalQuestion {
  id: number;
  question: string;
  category: 'motivacao' | 'valores' | 'objetivos' | 'desenvolvimento' | 'feedback';
}

const finalQuestions: FinalQuestion[] = [
  {
    id: 21,
    question: "O que mais me motiva no trabalho é a possibilidade de crescimento e aprendizado",
    category: 'motivacao'
  },
  {
    id: 22,
    question: "Eu valorizo um ambiente de trabalho colaborativo e inclusivo",
    category: 'valores'
  },
  {
    id: 23,
    question: "Meus objetivos profissionais estão alinhados com os da empresa",
    category: 'objetivos'
  },
  {
    id: 24,
    question: "Eu busco constantemente me desenvolver e adquirir novas habilidades",
    category: 'desenvolvimento'
  },
  {
    id: 25,
    question: "Eu aceito feedback construtivo e uso para melhorar meu desempenho",
    category: 'feedback'
  }
];

export default function Step4Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleAnswer = (questionId: number, answer: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < finalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < finalQuestions.length) {
      alert('Por favor, responda todas as perguntas antes de continuar.');
      return;
    }

    setLoading(true);
    
    try {
      // Salvar respostas finais
      const response = await fetch('/api/v1/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          step: 4,
          answers: answers,
          type: 'final'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas');
      }

      // Marcar avaliação como completa
      await fetch('/api/v1/candidates/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          completed: true,
          completedAt: new Date().toISOString()
        }),
      });

      // Redirecionar para página de finalização
      router.push('/form/finish');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar respostas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const question = finalQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / finalQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Passo 4: Avaliação Final
            </h1>
            <p className="text-gray-600">
              Últimas perguntas para completar sua avaliação comportamental
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Passo 4 de 4</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Question Counter */}
          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">
              Pergunta {currentQuestion + 1} de {finalQuestions.length}
            </span>
          </div>

          {/* Current Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {question.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(question.id, option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    answers[question.id] === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {option === 1 && 'Discordo Totalmente'}
                      {option === 2 && 'Discordo'}
                      {option === 3 && 'Neutro'}
                      {option === 4 && 'Concordo'}
                      {option === 5 && 'Concordo Totalmente'}
                    </span>
                    {answers[question.id] === option && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Anterior
            </Button>
            
            {currentQuestion < finalQuestions.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!answers[question.id]}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Próxima Pergunta
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || Object.keys(answers).length < finalQuestions.length}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Finalizando...' : 'Completar Avaliação'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
