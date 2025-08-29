'use client';

import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const handleStartAssessment = () => {
    router.push('/form');
  };
  
  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Carregando...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-blue-600">SPAC</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                {user.email}
              </span>
              <Button onClick={handleLogout} className="text-sm">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8 rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-900">
                Bem-vindo ao Dashboard!
              </h1>
              <p className="mt-2 text-gray-600">
                Este é o seu painel de controle do Sistema Propósito de Avaliação Comportamental.
              </p>
              <div className="mt-8">
                <Button onClick={handleStartAssessment}>
                  Iniciar Avaliação Comportamental
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

