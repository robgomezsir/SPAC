import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zibuyabpsvgulvigvdtb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYnV5YWJwc3ZndWx2aWd2ZHRiIiwicm9sZSI6ImFub24iLCJiYXQiOjE3NTYxNzQ3NjUsImV4cCI6MjA3MTc1MDc2NX0.a1EoCpinPFQqBd_ZYOT7n7iViH3NCwIzldzcBLlvfNo'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in the environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
