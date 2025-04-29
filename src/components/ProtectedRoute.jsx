import { Navigate, useLocation } from 'react-router-dom';
import { isAuthRequired, isAdminOnly, isGuestOnly } from '../constants/protectedRoutes';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Nếu là Admin và không phải route /admin thì chuyển hướng về /admin
  if (user && user.role === 'Admin' && !currentPath.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }

  // Check if route is guest-only and user is logged in
  if (isGuestOnly(currentPath)) {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // Check if route requires authentication
  if (isAuthRequired(currentPath)) {
    if (!user) {
      return <Navigate to="/login" replace state={{ from: currentPath }} />;
    }
    return children;
  }

  // Check if route is admin-only
  if (isAdminOnly(currentPath)) {
    if (!user || user.role !== 'Admin') {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // Check for specific role requirements
  if (requiredRole) {
    if (!user || user.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // For public routes
  return children;
};

export default ProtectedRoute; 