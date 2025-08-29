'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';

interface Categoria {
  id: number;
  nome: string;
}

interface Pergunta {
  id: number;
  texto: string;
  categorias: Categoria;
}

interface Respostas {
  [key: number]: number;
}

export default function AvaliacaoPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Respostas>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const { data, error } = await supabase
          .from('perguntas')
          .select('id, texto, categorias(id, nome)')
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setPerguntas(data as Pergunta[]);
        }
      } catch (err: any) {
        console.error('Erro ao buscar perguntas:', err);
        setError('Não foi possível carregar a avaliação. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerguntas();
  }, []);

  const handleAnswerSelect = (perguntaId: number, resposta: number) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: resposta,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < perguntas.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Sessão de usuário não encontrada. Por favor, faça login novamente.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const respostasParaInserir = Object.entries(respostas).map(([pergunta_id, resposta]) => ({
      user_id: user.id,
      pergunta_id: parseInt(pergunta_id, 10),
      resposta: resposta,
    }));

    try {
      const { error: insertError } = await supabase.from('respostas_usuarios').insert(respostasParaInserir);

      if (insertError) {
        throw insertError;
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro ao submeter respostas:', err);
      setError('Ocorreu um erro ao enviar suas respostas. Tente novamente.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Carregando avaliação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
        <div>
          <p className="text-red-500 font-semibold">{error}</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (perguntas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
        <div>
          <p className="text-gray-600">Nenhuma pergunta encontrada para a avaliação.</p>
           <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = perguntas[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === perguntas.length - 1;
  const progress = ((currentQuestionIndex + 1) / perguntas.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{currentQuestion.categorias?.nome || 'Geral'}</h2>
            <span className="text-sm text-gray-500">
              Pergunta {currentQuestionIndex + 1} de {perguntas.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </header>

        <main>
          <p className="text-xl font-medium text-gray-800 text-center mb-8 min-h-[6rem] flex items-center justify-center">
            {currentQuestion.texto}
          </p>
          <div className="flex justify-center space-x-2 sm:space-x-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswerSelect(currentQuestion.id, value)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${respostas[currentQuestion.id] === value
                    ? 'bg-blue-600 text-white scale-110 shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {value}
              </button>
            ))}
          </div>
        </main>

        <footer className="mt-10 flex justify-between items-center">
          <Button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Anterior
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={submitting || respostas[currentQuestion.id] === undefined}>
              {submitting ? 'Enviando...' : 'Finalizar e Enviar'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={respostas[currentQuestion.id] === undefined}>
              Próxima
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
