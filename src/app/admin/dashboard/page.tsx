'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { AdminRoute } from '../../../components/auth/ProtectedRoute';
import Button from '../../../components/ui/Button';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalAssessments: number;
  completedAssessments: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastBackup: string;
  databaseSize: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSystemStats();
    }
  }, [user]);

  const fetchSystemStats = async () => {
    try {
      // Simular dados do sistema (em produção, buscar da API)
      const mockStats: SystemStats = {
        totalUsers: 1250,
        activeUsers: 1180,
        totalAssessments: 3420,
        completedAssessments: 2980,
        systemHealth: 'healthy',
        lastBackup: new Date().toISOString(),
        databaseSize: '2.4 GB',
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">
              Gerencie o sistema SPAC e monitore o desempenho
            </p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avaliações Completas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completedAssessments.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saúde do Sistema</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      stats.systemHealth === 'healthy' ? 'bg-green-100 text-green-800' :
                      stats.systemHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stats.systemHealth === 'healthy' ? 'Saudável' :
                       stats.systemHealth === 'warning' ? 'Atenção' : 'Crítico'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tamanho do Banco</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.databaseSize}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push('/admin/users')}
                className="w-full justify-center"
              >
                👥 Gerenciar Usuários
              </Button>
              
              <Button
                onClick={() => router.push('/admin/system')}
                variant="outline"
                className="w-full justify-center"
              >
                ⚙️ Configurações do Sistema
              </Button>
              
              <Button
                onClick={() => router.push('/admin/backup')}
                variant="outline"
                className="w-full justify-center"
              >
                💾 Backup e Restauração
              </Button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Último Backup</h3>
                <p className="text-gray-600">
                  {stats ? new Date(stats.lastBackup).toLocaleString('pt-BR') : 'N/A'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status da Aplicação</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
            >
              ← Voltar ao Dashboard
            </Button>
            
            <Button
              onClick={() => router.push('/admin/users')}
            >
              Gerenciar Usuários →
            </Button>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
