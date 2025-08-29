'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function CadastroPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.');
      setName('');
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta no SPAC
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              faça login se já possui uma conta
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-t-md"
              />
            </div>
            <div>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-b-md"
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </div>

          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}
