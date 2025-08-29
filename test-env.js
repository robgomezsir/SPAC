// Teste de variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTE' : 'NÃO EXISTE');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('=====================================');
