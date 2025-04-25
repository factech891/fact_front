// src/components/ProtectedRoute.js (actualizado para visor)
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rutas basado en autenticación y roles
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Elementos hijos a renderizar si está autenticado
 * @param {Array} props.requiredRoles - Roles requeridos para acceder a la ruta (opcional)
 * @param {boolean} props.allowVisorReadOnly - Permitir acceso de solo lectura a visores (opcional)
 * @returns {React.ReactElement} Componente hijo o redirección
 */
const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  allowVisorReadOnly = false 
}) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Verificar si la ruta es para crear o editar
  const isCreateOrEditRoute = () => {
    return location.pathname.includes('/new') || 
           location.pathname.includes('/edit/') ||
           location.pathname.includes('/create');
  };

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
  
  // Si el usuario es visor e intenta acceder a una ruta de creación/edición,
  // y la opción allowVisorReadOnly no está habilitada, redirigir a la ruta principal
  if (currentUser.role === 'visor' && isCreateOrEditRoute() && !allowVisorReadOnly) {
    // Determinar la ruta principal según el patrón de la URL actual
    let baseRoute = '/';
    
    if (location.pathname.includes('/invoices/')) {
      baseRoute = '/invoices';
    } else if (location.pathname.includes('/documents/')) {
      baseRoute = '/documents';
    } else if (location.pathname.includes('/clients/')) {
      baseRoute = '/clients';
    } else if (location.pathname.includes('/products/')) {
      baseRoute = '/products';
    }
    
    return <Navigate to={baseRoute} replace />;
  }

  // Si se requieren roles específicos, verificarlos
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(currentUser.role);
    
    if (!hasRequiredRole) {
      // Si es visor o facturador y no tiene acceso, redirigir según su rol
      if (currentUser.role === 'facturador') {
        return <Navigate to="/invoices" replace />;
      } else if (currentUser.role === 'visor') {
        // Para visores, intentar redirigir a una página apropiada
        if (location.pathname.startsWith('/users') || location.pathname.startsWith('/settings')) {
          return <Navigate to="/" replace />;
        }
      }
      
      // Para otros roles, usar página de no autorizado
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si todo está bien, mostrar la ruta protegida
  return children;
};

export default ProtectedRoute;