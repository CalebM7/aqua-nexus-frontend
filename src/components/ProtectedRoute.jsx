import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiresAuth, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  console.log('ProtectedRoute: Checking', {
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
    requiresAuth,
    pathname: location.pathname,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requiresAuth && isAuthenticated) {
    console.log('ProtectedRoute: Authenticated, redirecting to role-based dashboard');
    const destination = user.role === 'provider' ? '/provider-dashboard' : '/dashboard';
    return <Navigate to={destination} replace />;
  }

  if (requiresAuth && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('ProtectedRoute: Role not allowed, redirecting to /');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;