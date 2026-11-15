import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * ProtectedRoute Component:
 * - Checks authentication state from zustand authStore.
 * - Enforces role-based authorization ("assistant" or "client").
 * - Redirects unauthenticated users to /login preserving attempted location.
 * - Redirects unauthorized users to their authorized role dashboard.
 */
export default function ProtectedRoute({ children, allowedRole, allowedRoles }) {
  const location = useLocation();
  const { isAuthenticated, user, token } = useAuthStore();
  const isAuth = Boolean(isAuthenticated ?? (token && user));

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const validRoles = allowedRoles || (allowedRole ? [allowedRole] : []);
  if (validRoles.length > 0 && user?.role && !validRoles.includes(user.role)) {
    const fallbackPath = user.role === 'client' ? '/client' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
