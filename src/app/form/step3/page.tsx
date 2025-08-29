'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';

interface CompetencyQuestion {
  id: number;
  question: string;
  category: 'lideranca' | 'comunicacao' | 'resolucao_problemas' | 'trabalho_equipe' | 'adaptabilidade';
}

const competencyQuestions: CompetencyQuestion[] = [
  {
    id: 11,
    question: "Eu consigo motivar e inspirar outras pessoas a alcançarem objetivos",
    category: 'lideranca'
  },
  {
    id: 12,
    question: "Eu delego tarefas de forma eficiente e acompanho o progresso",
    category: 'lideranca'
  },
  {
    id: 13,
    question: "Eu me comunico de forma clara e objetiva com diferentes públicos",
    category: 'comunicacao'
  },
  {
    id: 14,
    question: "Eu sou um bom ouvinte e consigo entender diferentes pontos de vista",
    category: 'comunicacao'
  },
  {
    id: 15,
    question: "Eu identifico rapidamente problemas e proponho soluções criativas",
    category: 'resolucao_problemas'
  },
  {
    id: 16,
    question: "Eu analiso situações complexas e tomo decisões baseadas em dados",
    category: 'resolucao_problemas'
  },
  {
    id: 17,
    question: "Eu contribuo ativamente para o sucesso da equipe",
    category: 'trabalho_equipe'
  },
  {
    id: 18,
    question: "Eu compartilho conhecimento e ajudo colegas quando necessário",
    category: 'trabalho_equipe'
  },
  {
    id: 19,
    question: "Eu me adapto rapidamente a mudanças e novos desafios",
    category: 'adaptabilidade'
  },
  {
    id: 20,
    question: "Eu aprendo novas tecnologias e processos com facilidade",
    category: 'adaptabilidade'
  }
];

export default function Step3Page() {
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
    if (currentQuestion < competencyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < competencyQuestions.length) {
      alert('Por favor, responda todas as perguntas antes de continuar.');
      return;
    }

    setLoading(true);
    
    try {
      // Salvar respostas de competências
      const response = await fetch('/api/v1/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          step: 3,
          answers: answers,
          type: 'competency'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas');
      }

      // Redirecionar para próximo passo
      router.push('/form/step4');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar respostas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const question = competencyQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / competencyQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Passo 3: Avaliação de Competências
            </h1>
            <p className="text-gray-600">
              Avalie suas competências profissionais e comportamentais
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Passo 3 de 4</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Question Counter */}
          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">
              Pergunta {currentQuestion + 1} de {competencyQuestions.length}
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
                      {option === 1 && 'Muito Baixo'}
                      {option === 2 && 'Baixo'}
                      {option === 3 && 'Médio'}
                      {option === 4 && 'Alto'}
                      {option === 5 && 'Muito Alto'}
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
            
            {currentQuestion < competencyQuestions.length - 1 ? (
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
                disabled={loading || Object.keys(answers).length < competencyQuestions.length}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Salvando...' : 'Finalizar Passo 3'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
