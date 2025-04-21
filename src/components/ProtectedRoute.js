// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Si está cargando, no mostrar nada todavía
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, redirigir al login
  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Si se requieren roles específicos, verificarlos
  if (requiredRoles.length > 0) {
    const userRoles = currentUser.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // El usuario no tiene los roles necesarios
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si todo está bien, mostrar la ruta protegida
  return children;
};

export default ProtectedRoute;