'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';

interface PersonalityQuestion {
  id: number;
  question: string;
  category: 'extroversao' | 'responsabilidade' | 'amabilidade' | 'estabilidade' | 'abertura';
}

const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 1,
    question: "Eu sou uma pessoa que gosta de estar no centro das atenções",
    category: 'extroversao'
  },
  {
    id: 2,
    question: "Eu prefiro trabalhar em equipe do que sozinho",
    category: 'extroversao'
  },
  {
    id: 3,
    question: "Eu sempre cumpro meus compromissos no prazo",
    category: 'responsabilidade'
  },
  {
    id: 4,
    question: "Eu sou organizado e metódico em minhas tarefas",
    category: 'responsabilidade'
  },
  {
    id: 5,
    question: "Eu costumo confiar nas pessoas facilmente",
    category: 'amabilidade'
  },
  {
    id: 6,
    question: "Eu sou cooperativo e evito conflitos",
    category: 'amabilidade'
  },
  {
    id: 7,
    question: "Eu mantenho a calma mesmo em situações estressantes",
    category: 'estabilidade'
  },
  {
    id: 8,
    question: "Eu raramente me sinto ansioso ou preocupado",
    category: 'estabilidade'
  },
  {
    id: 9,
    question: "Eu gosto de experimentar coisas novas e diferentes",
    category: 'abertura'
  },
  {
    id: 10,
    question: "Eu tenho uma imaginação vívida e criativa",
    category: 'abertura'
  }
];

export default function Step2Page() {
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
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < personalityQuestions.length) {
      alert('Por favor, responda todas as perguntas antes de continuar.');
      return;
    }

    setLoading(true);
    
    try {
      // Salvar respostas de personalidade
      const response = await fetch('/api/v1/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          step: 2,
          answers: answers,
          type: 'personality'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas');
      }

      // Redirecionar para próximo passo
      router.push('/form/step3');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar respostas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const question = personalityQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Passo 2: Avaliação de Personalidade
            </h1>
            <p className="text-gray-600">
              Responda as perguntas sobre sua personalidade e comportamento
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Passo 2 de 4</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Question Counter */}
          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">
              Pergunta {currentQuestion + 1} de {personalityQuestions.length}
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
            
            {currentQuestion < personalityQuestions.length - 1 ? (
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
                disabled={loading || Object.keys(answers).length < personalityQuestions.length}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Salvando...' : 'Finalizar Passo 2'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
