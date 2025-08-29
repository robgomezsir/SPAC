'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface Step1Data {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
}

export default function Step1Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Step1Data>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    cargo: ''
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleInputChange = (field: keyof Step1Data, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (!formData.nome || !formData.email) {
      alert('Por favor, preencha pelo menos nome e email.');
      return;
    }

    setLoading(true);
    
    try {
      // Salvar dados do candidato
      const response = await fetch('/api/v1/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar dados');
      }

      // Redirecionar para próximo passo
      router.push('/form/step2');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Passo 1: Informações Pessoais
            </h1>
            <p className="text-gray-600">
              Preencha suas informações básicas para começar a avaliação
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Passo 1 de 4</span>
              <span className="text-sm text-gray-500">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <Input
                  id="empresa"
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <Input
                  id="cargo"
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  placeholder="Seu cargo atual"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                onClick={() => router.push('/dashboard')}
                variant="outline"
              >
                Voltar ao Dashboard
              </Button>
              
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Salvando...' : 'Próximo Passo'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
