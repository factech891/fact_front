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

  // Si estamos en dashboard y el usuario es facturador, redirigir a facturas
  if ((location.pathname === '/' || location.pathname === '/dashboard') && 
      currentUser.role === 'facturador') {
    return <Navigate to="/invoices" replace />;
  }

  // Si se requieren roles específicos, verificarlos
  if (requiredRoles.length > 0) {
    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRequiredRole = requiredRoles.some(role => currentUser.role === role);
    
    if (!hasRequiredRole) {
      // El usuario no tiene los roles necesarios
      // Si es facturador, redirigir a facturas, sino a página no autorizada
      if (currentUser.role === 'facturador') {
        return <Navigate to="/invoices" replace />;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si todo está bien, mostrar la ruta protegida
  return children;
};

export default ProtectedRoute;