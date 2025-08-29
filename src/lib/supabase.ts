import { createClient } from '@supabase/supabase-js'

// Validação rigorosa de variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validação de segurança para variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ CRÍTICO: Variáveis de ambiente do Supabase não configuradas!\n' +
    'Crie um arquivo .env.local na raiz do projeto com:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui\n' +
    '\nPara produção, NUNCA use valores hardcoded!'
  );
}

// Validação adicional de formato das variáveis
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error('❌ URL do Supabase inválida. Deve ser uma URL HTTPS válida do Supabase.');
}

if (supabaseAnonKey.length < 100) {
  throw new Error('❌ Chave anônima do Supabase inválida. Verifique o formato.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
