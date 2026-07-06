import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/authStore';
import type { ReactNode } from 'react';

export function ProtectedRoute({ roles, children }: { roles?: ('USER' | 'ADMIN')[]; children?: ReactNode }) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const hasRole = useAuth((s) => s.hasRole);
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.some(r => hasRole(r))) {
    return <Navigate to="/" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
