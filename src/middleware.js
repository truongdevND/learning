import { Navigate, useLocation } from 'react-router-dom';
import { isAuthRequired, isAdminOnly, isGuestOnly } from './constants/protectedRoutes';

export const authMiddleware = (Component, requiredRole = null) => {
  return (props) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    if (user && user.role === 'Admin' && !currentPath.startsWith('/admin')) {
      return <Navigate to="/admin" replace />;
    }

    if (isAuthRequired(currentPath) && !user) {
      return <Navigate to="/login" replace state={{ from: currentPath }} />;
    }

    if (isAdminOnly(currentPath) && (!user || user.role !== 'Admin')) {
      return <Navigate to="/" replace />;
    }

    if (isGuestOnly(currentPath) && user) {
      return <Navigate to="/" replace />;
    }

    if (requiredRole && (!user || user.role !== requiredRole)) {
      return <Navigate to="/" replace />;
    }

    return <Component {...props} />;
  };
};

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const clearUser = () => {
  localStorage.removeItem('user');
};