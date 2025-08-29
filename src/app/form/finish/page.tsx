'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';

interface AssessmentSummary {
  totalQuestions: number;
  completedSteps: number;
  completionDate: string;
  estimatedScore: number;
}

export default function FinishPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Buscar resumo da avaliação
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/v1/scores/summary/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        }
      } catch (error) {
        console.error('Erro ao buscar resumo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user, router]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resumo da avaliação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Avaliação Completada com Sucesso!
            </h1>
            <p className="text-gray-600">
              Parabéns! Você finalizou sua avaliação comportamental no SPAC
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {summary?.totalQuestions || 25}
              </div>
              <div className="text-sm text-blue-700">Perguntas Respondidas</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {summary?.completedSteps || 4}
              </div>
              <div className="text-sm text-green-700">Passos Completados</div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {summary?.estimatedScore || '85'}%
              </div>
              <div className="text-sm text-purple-700">Score Estimado</div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {summary?.completionDate ? new Date(summary.completionDate).toLocaleDateString('pt-BR') : 'Hoje'}
              </div>
              <div className="text-sm text-orange-700">Data de Conclusão</div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              O que acontece agora?
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <p>Nossa equipe de RH analisará suas respostas e criará um perfil comportamental detalhado</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <p>Você receberá um relatório completo com suas principais características e pontos de desenvolvimento</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <p>Seus resultados serão compartilhados com a equipe de recrutamento para análise do perfil</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Próximos Passos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">📧 Notificação por E-mail</h3>
                <p className="text-sm text-gray-600">
                  Você receberá uma confirmação por e-mail com os detalhes da sua avaliação
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">📊 Relatório Detalhado</h3>
                <p className="text-sm text-gray-600">
                  Em até 48 horas, você receberá um relatório completo com seus resultados
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">🤝 Entrevista</h3>
                <p className="text-sm text-gray-600">
                  Nossa equipe entrará em contato para agendar uma entrevista de feedback
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">💼 Processo Seletivo</h3>
                <p className="text-sm text-gray-600">
                  Seu perfil será avaliado para as próximas etapas do processo seletivo
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Voltar ao Dashboard
            </Button>
            
            <Button
              onClick={() => window.print()}
              variant="outline"
            >
              📄 Imprimir Comprovante
            </Button>
            
            <Button
              onClick={() => router.push('/auth/login')}
              variant="outline"
            >
              Sair do Sistema
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Obrigado por participar da nossa avaliação comportamental! 
              <br />
              Seus dados estão seguros e serão tratados com confidencialidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
