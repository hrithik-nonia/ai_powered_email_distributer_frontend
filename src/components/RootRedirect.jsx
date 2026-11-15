import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * RootRedirect Component:
 * - Redirects "/" dynamically based on authentication status and user role.
 * - Non-authenticated -> /login
 * - Assistant -> /dashboard
 * - Client -> /client
 */
export default function RootRedirect() {
  const { isAuthenticated, user, token } = useAuthStore();
  const isAuth = Boolean(isAuthenticated ?? (token && user));

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user?.role === 'client' ? '/client' : '/dashboard'} replace />;
}
