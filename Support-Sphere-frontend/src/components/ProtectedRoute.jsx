import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route and redirects to the appropriate login page if:
 * - no valid token exists (not logged in)
 * - requireRole is set and the user's role doesn't match
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>...</Route>                     — any logged-in user
 *   <Route element={<ProtectedRoute requireRole="admin" />}>...</Route> — admin only
 */
function ProtectedRoute({ children, requireRole }) {
  const { user, token } = useAuth();
  const location = useLocation();

  const loginPath = requireRole === 'admin' ? '/admin/login' : requireRole === 'counselor' ? '/student/login' : '/landing';

  // No token at all — definitely not logged in
  if (!token) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Token exists but profile hasn't loaded yet — render nothing briefly
  // rather than flashing a redirect (AuthContext resolves this fast)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  // Role check
  if (requireRole && user.role !== requireRole) {
    return <Navigate to={loginPath} replace />;
  }

  return children;
}

export default ProtectedRoute;