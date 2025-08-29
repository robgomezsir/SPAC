'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { canAccess, getUserProfile } from '../../lib/auth';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: {
    resource: string;
    action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  };
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuthorization() {
      if (loading) return;

      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        // Verificar perfil do usuário
        const profile = await getUserProfile(user.id);
        
        if (!profile) {
          console.error('Perfil do usuário não encontrado');
          router.push('/auth/login');
          return;
        }

        // Verificar se o usuário está ativo
        if (!profile.is_active) {
          console.error('Usuário inativo');
          router.push('/auth/login');
          return;
        }

        // Verificar permissão específica se fornecida
        if (requiredPermission) {
          if (!canAccess(profile.role, requiredPermission.resource, requiredPermission.action)) {
            setAuthorized(false);
            setChecking(false);
            return;
          }
        }

        // Verificar role se fornecida
        if (requiredRole) {
          const roleHierarchy: Record<UserRole, number> = {
            'CANDIDATE': 1,
            'RH': 2,
            'ADMIN': 3,
            'SUPER_ADMIN': 4,
          };

          if (roleHierarchy[profile.role] < roleHierarchy[requiredRole]) {
            setAuthorized(false);
            setChecking(false);
            return;
          }
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Erro ao verificar autorização:', error);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    }

    checkAuthorization();
  }, [user, loading, router, requiredRole, requiredPermission]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Componente de proteção para rotas administrativas
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      {children}
    </ProtectedRoute>
  );
}

// Componente de proteção para rotas de RH
export function RHRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="RH">
      {children}
    </ProtectedRoute>
  );
}

// Componente de proteção para super admin
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      {children}
    </ProtectedRoute>
  );
}
