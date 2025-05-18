import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ requiresAuth, children }) {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requiresAuth && isAuthenticated) {
    // Authenticated users shouldn't access login/signup
    const redirectTo = user?.role === "provider" ? "/provider-dashboard" : "/dashboard";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children for valid cases
  return children;
}