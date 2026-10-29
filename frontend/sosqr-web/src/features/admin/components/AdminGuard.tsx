import type { FC, ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

interface AdminGuardProps {
  children?: ReactNode;
}

/**
 * Guarda de rota administrativa do SOSqr.
 * Valida se o usuário autenticado no Supabase possui permissão administrativa (isAdmin).
 * Redireciona para /dashboard caso o acesso não seja autorizado.
 */
export const AdminGuard: FC<AdminGuardProps> = ({ children }) => {
  const { loading, isAdmin, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-3 border-[#0B6651] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-semibold text-stone-500">
          Verificando permissões administrativas...
        </p>
      </div>
    );
  }

  if (isConfigured && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminGuard;
