// Configurações de segurança para a aplicação SPAC

// Headers de segurança
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
  ].join('; '),
};

// Configurações de senha
export const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // dias
  preventReuse: 5, // últimas 5 senhas
};

// Configurações de sessão
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60, // 24 horas em segundos
  refreshThreshold: 60 * 60, // 1 hora em segundos
  maxConcurrentSessions: 3,
  idleTimeout: 30 * 60, // 30 minutos em segundos
};

// Configurações de rate limiting
export const RATE_LIMIT_CONFIG = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas
    blockDuration: 30 * 60 * 1000, // bloqueio por 30 minutos
  },
  api: {
    windowMs: 60 * 1000, // 1 minuto
    max: 100, // máximo 100 requisições
  },
  assessment: {
    windowMs: 60 * 1000, // 1 minuto
    max: 10, // máximo 10 submissões
  },
};

// Configurações de auditoria
export const AUDIT_CONFIG = {
  enabled: true,
  logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
  events: [
    'user.login',
    'user.logout',
    'user.register',
    'user.password_change',
    'assessment.submit',
    'assessment.view',
    'admin.action',
    'system.config_change',
  ],
  retention: 365, // dias
};

// Configurações de backup
export const BACKUP_CONFIG = {
  enabled: true,
  schedule: '0 2 * * *', // 2 AM diariamente
  retention: 30, // dias
  encryption: true,
  compression: true,
  locations: ['local', 'cloud'], // local e cloud
};

// Configurações de monitoramento
export const MONITORING_CONFIG = {
  enabled: true,
  metrics: [
    'response_time',
    'error_rate',
    'user_activity',
    'system_resources',
    'database_performance',
  ],
  alerts: {
    errorThreshold: 5, // alerta após 5 erros
    responseTimeThreshold: 2000, // alerta se > 2s
    diskUsageThreshold: 80, // alerta se > 80%
    memoryUsageThreshold: 85, // alerta se > 85%
  },
};

// Função para validar senha
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`A senha deve ter pelo menos ${PASSWORD_POLICY.minLength} caracteres`);
  }
  
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Função para calcular força da senha
export function calculatePasswordStrength(password: string): {
  score: number; // 0-100
  level: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];
  
  // Comprimento
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Complexidade
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  
  // Padrões
  if (!/(.)\1{2,}/.test(password)) score += 10; // sem repetição de 3+ caracteres
  if (!/(.)(.)\1\2/.test(password)) score += 10; // sem padrões repetitivos
  
  // Determinar nível
  let level: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  if (score < 30) level = 'very_weak';
  else if (score < 50) level = 'weak';
  else if (score < 70) level = 'medium';
  else if (score < 90) level = 'strong';
  else level = 'very_strong';
  
  // Feedback baseado no score
  if (score < 30) feedback.push('Sua senha é muito fraca. Considere usar uma senha mais complexa.');
  if (score < 50) feedback.push('Sua senha pode ser melhorada. Adicione mais variedade de caracteres.');
  if (score < 70) feedback.push('Sua senha é moderada. Considere adicionar caracteres especiais.');
  if (score < 90) feedback.push('Sua senha é boa, mas pode ser ainda melhor.');
  if (score >= 90) feedback.push('Excelente! Sua senha é muito forte.');
  
  return { score, level, feedback };
}

// Função para sanitizar entrada do usuário
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, ''); // Remove data URLs
}

// Função para validar email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para gerar token seguro
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função para verificar se é ambiente de produção
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Função para obter configuração baseada no ambiente
export function getConfigByEnvironment<T>(config: {
  development: T;
  production: T;
  test: T;
}): T {
  const env = process.env.NODE_ENV || 'development';
  return config[env as keyof typeof config] || config.development;
}
