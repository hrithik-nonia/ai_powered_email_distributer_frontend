import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * PublicRoute Component:
 * - Restricts access to unauthenticated visitors only.
 * - Redirects logged-in users away from auth pages to their role dashboard.
 */
export default function PublicRoute({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const isAuth = Boolean(isAuthenticated ?? (token && user));

  if (isAuth) {
    const redirectPath = user?.role === 'client' ? '/client' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
