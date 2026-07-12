import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/authStore';
import type { ReactNode } from 'react';

export function ProtectedRoute({ roles, children }: { roles?: ('USER' | 'ADMIN')[]; children?: ReactNode }) {
  const _isAuthenticated = useAuth((s) => s.isAuthenticated);
  const hasRole = useAuth((s) => s.hasRole);
  const _location = useLocation();

  if (!_isAuthenticated()) {
    return <Navigate to="/login" state={{ from: _location }} replace />;
  }
  if (roles && !roles.some(r => hasRole(r))) {
    return <Navigate to="/" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
