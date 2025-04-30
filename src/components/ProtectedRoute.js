// src/components/ProtectedRoute.js (con logs de depuración)
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({
  children,
  requiredRoles = [],
  allowVisorReadOnly = false
}) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // --- LOG INICIAL ---
  console.log(`[ProtectedRoute] Path: ${location.pathname}`);
  console.log(`[ProtectedRoute] Auth Loading: ${loading}`);
  console.log(`[ProtectedRoute] Current User:`, currentUser); // Loguear el objeto completo
  console.log(`[ProtectedRoute] Required Roles:`, requiredRoles);

  const isCreateOrEditRoute = () => {
    return location.pathname.includes('/new') ||
           location.pathname.includes('/edit/') ||
           location.pathname.includes('/create');
  };

  // Si está cargando, no mostrar nada todavía
  if (loading) {
    console.log(`[ProtectedRoute] Renderizando: Cargando... (Auth Loading es true)`);
    return <div>Cargando...</div>; // O un spinner más elegante
  }

  // Si no hay usuario, redirigir al login
  if (!currentUser) {
    console.log(`[ProtectedRoute] Redirigiendo a /auth/login (currentUser es null o undefined)`);
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // --- LOG DESPUÉS DE VERIFICAR LOADING Y CURRENTUSER ---
  console.log(`[ProtectedRoute] Usuario existe y carga finalizada. Rol: ${currentUser.role}`);


  // Si estamos en dashboard y el usuario es facturador, redirigir a facturas
  if ((location.pathname === '/' || location.pathname === '/dashboard') &&
      currentUser.role === 'facturador') {
    console.log(`[ProtectedRoute] Redirigiendo a /invoices (Facturador en Dashboard)`);
    return <Navigate to="/invoices" replace />;
  }

  // Si el usuario es visor e intenta acceder a una ruta de creación/edición...
  if (currentUser.role === 'visor' && isCreateOrEditRoute() && !allowVisorReadOnly) {
    let baseRoute = '/';
    // ... (lógica de baseRoute)
    console.log(`[ProtectedRoute] Redirigiendo a ${baseRoute} (Visor en ruta Create/Edit)`);
    return <Navigate to={baseRoute} replace />;
  }

  // Si se requieren roles específicos, verificarlos
  if (requiredRoles.length > 0) {
    console.log(`[ProtectedRoute] Verificando roles requeridos: ${requiredRoles}. Rol actual: ${currentUser.role}`);
    const hasRequiredRole = requiredRoles.includes(currentUser.role);
    console.log(`[ProtectedRoute] ¿Tiene rol requerido? ${hasRequiredRole}`);

    if (!hasRequiredRole) {
      console.log(`[ProtectedRoute] ¡Rol NO coincide! Redirigiendo...`);
      // Si es visor o facturador y no tiene acceso, redirigir según su rol
      if (currentUser.role === 'facturador') {
        console.log(`[ProtectedRoute] ...a /invoices (Facturador sin rol requerido)`);
        return <Navigate to="/invoices" replace />;
      } else if (currentUser.role === 'visor') {
        if (location.pathname.startsWith('/users') || location.pathname.startsWith('/settings')) {
           console.log(`[ProtectedRoute] ...a / (Visor sin rol requerido en Users/Settings)`);
          return <Navigate to="/" replace />;
        }
      }

      // Para otros roles (incluyendo platform_admin si no coincide), usar página de no autorizado
      console.log(`[ProtectedRoute] ...a /unauthorized (Rol no coincide)`);
      return <Navigate to="/unauthorized" replace />;
    } else {
       console.log(`[ProtectedRoute] Rol coincide. Permitiendo acceso.`);
    }
  } else {
      console.log(`[ProtectedRoute] No se requieren roles específicos. Permitiendo acceso.`);
  }

  // Si todo está bien, mostrar la ruta protegida
  console.log(`[ProtectedRoute] Renderizando children.`);
  return children;
};

export default ProtectedRoute;