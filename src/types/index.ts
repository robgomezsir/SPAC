// Tipos de usuário
export interface User {
  id: string;
  email: string;
  nome?: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos de candidato
export interface Candidate {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
}

// Tipos de pontuação
export interface Score {
  id: string;
  user_id: string;
  step: number;
  answers: Record<number, number>;
  type: 'personality' | 'competency' | 'final';
  total_score: number;
  average_score: number;
  created_at: string;
}

// Tipos de pergunta
export interface Question {
  id: number;
  texto: string;
  categorias: Category[];
}

export interface Category {
  id: number;
  nome: string;
}

// Tipos de avaliação
export interface Assessment {
  id: string;
  candidate_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  current_step: number;
  total_steps: number;
  started_at: string;
  completed_at?: string;
  scores: Score[];
}

// Tipos de resposta
export interface Answer {
  questionId: number;
  value: number;
  category: string;
}

// Tipos de formulário
export interface FormData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
}

// Tipos de API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos de configuração
export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  appUrl: string;
  environment: 'development' | 'staging' | 'production';
}

// Tipos de erro
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Tipos de sessão
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

// Tipos de notificação
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
