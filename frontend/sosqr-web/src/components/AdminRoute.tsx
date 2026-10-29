import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
  const { loading, user, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B6651]" />
      </div>
    );
  }

  if (isConfigured && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
