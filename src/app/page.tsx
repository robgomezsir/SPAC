'use client';

import Link from 'next/link';

// Forçar renderização dinâmica para evitar SSG
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-4xl mx-auto">
        {/* Logo e Título */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">SPAC</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-4">
            Bem-vindo ao SPAC
          </h1>
          <p className="text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            Sistema Propósito de Avaliação Comportamental
          </p>
        </div>

        {/* Menu de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card de Login */}
          <Link href="/auth/login" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-blue-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Entrar no Sistema</h3>
              <p className="text-gray-600 text-sm">Acesse sua conta para continuar</p>
            </div>
          </Link>

          {/* Card de Registro */}
          <Link href="/auth/register" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-green-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Criar Conta</h3>
              <p className="text-gray-600 text-sm">Registre-se para começar a usar</p>
            </div>
          </Link>

          {/* Card de Avaliação */}
          <Link href="/form" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-purple-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Iniciar Avaliação</h3>
              <p className="text-gray-600 text-sm">Comece sua avaliação comportamental</p>
            </div>
          </Link>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
              Começar Agora
            </button>
          </Link>
          
          <Link href="/dashboard">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-300 border border-gray-300">
              Ver Dashboard
            </button>
          </Link>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sobre o SPAC</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🎯 Propósito</h3>
              <p>Avaliação comportamental para desenvolvimento pessoal e profissional</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🔒 Seguro</h3>
              <p>Dados protegidos com criptografia e controle de acesso</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📊 Análise</h3>
              <p>Relatórios detalhados e insights personalizados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
