// src/components/RoleBasedAccess.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

// Este componente muestra su contenido solo si el usuario tiene alguno de los roles requeridos
const RoleBasedAccess = ({ children, requiredRoles = [], fallback = null }) => {
  const { currentUser } = useAuth();
  
  // Si no hay usuario o no tiene propiedad roles
  if (!currentUser || !currentUser.roles) {
    return fallback;
  }
  
  // Verificar si el usuario tiene alguno de los roles requeridos
  const userRoles = currentUser.roles;
  const hasAccess = requiredRoles.length === 0 || 
                    requiredRoles.some(role => userRoles.includes(role));
  
  return hasAccess ? children : fallback;
};

export default RoleBasedAccess;