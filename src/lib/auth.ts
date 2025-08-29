import { createClient } from '@supabase/supabase-js';
import { UserRole, Permission, UserProfile } from '../types';

// Cliente Supabase para operações de autorização
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Configuração de permissões por perfil
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CANDIDATE: [
    { id: '1', name: 'view_own_profile', resource: 'profile', action: 'read' },
    { id: '2', name: 'update_own_profile', resource: 'profile', action: 'update' },
    { id: '3', name: 'submit_assessment', resource: 'assessment', action: 'create' },
    { id: '4', name: 'view_own_results', resource: 'results', action: 'read' },
  ],
  RH: [
    { id: '5', name: 'view_candidates', resource: 'candidates', action: 'read' },
    { id: '6', name: 'view_assessments', resource: 'assessments', action: 'read' },
    { id: '7', name: 'export_reports', resource: 'reports', action: 'read' },
    { id: '8', name: 'manage_candidates', resource: 'candidates', action: 'manage' },
  ],
  ADMIN: [
    { id: '9', name: 'manage_users', resource: 'users', action: 'manage' },
    { id: '10', name: 'manage_system', resource: 'system', action: 'manage' },
    { id: '11', name: 'view_analytics', resource: 'analytics', action: 'read' },
    { id: '12', name: 'manage_backups', resource: 'backups', action: 'manage' },
  ],
  SUPER_ADMIN: [
    { id: '13', name: 'full_access', resource: '*', action: 'manage' },
  ],
};

// Função para verificar se um usuário tem uma permissão específica
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  
  // SUPER_ADMIN tem acesso total
  if (userRole === 'SUPER_ADMIN') return true;
  
  // Verificar permissão específica
  return permissions.some(permission => 
    (permission.resource === resource || permission.resource === '*') &&
    (permission.action === action || permission.action === 'manage')
  );
}

// Função para verificar se um usuário pode acessar um recurso
export function canAccess(
  userRole: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
): boolean {
  return hasPermission(userRole, resource, action);
}

// Função para obter perfil do usuário com validação de segurança
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single();

    if (error || !profile) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }

    return profile as UserProfile;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }
}

// Função para verificar se um usuário está ativo e não bloqueado
export function isUserActive(profile: UserProfile): boolean {
  if (!profile.is_active) return false;
  
  // Verificar se o usuário não está bloqueado
  if (profile.locked_until && new Date(profile.locked_until) > new Date()) {
    return false;
  }
  
  return true;
}

// Função para verificar se um usuário pode fazer login
export function canUserLogin(profile: UserProfile): boolean {
  if (!isUserActive(profile)) return false;
  
  // Verificar se não excedeu tentativas de login
  if (profile.failed_login_attempts >= 5) {
    return false;
  }
  
  return true;
}

// Função para registrar tentativa de login
export async function recordLoginAttempt(
  userId: string,
  success: boolean
): Promise<void> {
  try {
    if (success) {
      // Reset de tentativas falhadas e incremento de login
      await supabase
        .from('user_profiles')
        .update({
          last_login: new Date().toISOString(),
          login_count: supabase.rpc('increment', { row_id: userId, column_name: 'login_count' }),
          failed_login_attempts: 0,
        })
        .eq('id', userId);
    } else {
      // Incrementar tentativas falhadas
      await supabase
        .from('user_profiles')
        .update({
          failed_login_attempts: supabase.rpc('increment', { row_id: userId, column_name: 'failed_login_attempts' }),
        })
        .eq('id', userId);
      
      // Bloquear usuário após 5 tentativas falhadas
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('failed_login_attempts')
        .eq('id', userId)
        .single();
      
      if (profile && profile.failed_login_attempts >= 5) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 30); // Bloquear por 30 minutos
        
        await supabase
          .from('user_profiles')
          .update({
            locked_until: lockUntil.toISOString(),
          })
          .eq('id', userId);
      }
    }
  } catch (error) {
    console.error('Erro ao registrar tentativa de login:', error);
  }
}

// Função para verificar permissões de rota
export function checkRouteAccess(
  userRole: UserRole,
  route: string
): boolean {
  const routePermissions: Record<string, { resource: string; action: string }> = {
    '/dashboard': { resource: 'dashboard', action: 'read' },
    '/settings': { resource: 'settings', action: 'read' },
    '/settings/users': { resource: 'users', action: 'read' },
    '/settings/backup': { resource: 'backups', action: 'read' },
    '/settings/api-panel': { resource: 'system', action: 'read' },
    '/admin': { resource: 'admin', action: 'read' },
    '/admin/dashboard': { resource: 'admin', action: 'read' },
    '/admin/users': { resource: 'users', action: 'manage' },
    '/admin/system': { resource: 'system', action: 'manage' },
  };

  const permission = routePermissions[route];
  if (!permission) return true; // Rotas não mapeadas são permitidas por padrão

  return canAccess(userRole, permission.resource, permission.action as any);
}
