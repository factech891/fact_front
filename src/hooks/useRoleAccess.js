// src/hooks/useRoleAccess.js
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para verificar permisos basados en roles
 * @returns Objeto con funciones para verificar permisos
 */
export const useRoleAccess = () => {
  const { currentUser } = useAuth();

  /**
   * Verifica si el usuario tiene permiso para crear/editar entidades
   * @returns {boolean} true si tiene permiso, false en caso contrario
   */
  const canEdit = () => {
    if (!currentUser || !currentUser.role) return false;
    
    // El rol "visor" solo puede ver, no editar
    if (currentUser.role === 'visor') return false;
    
    // Otros roles (admin, gerente, facturador) pueden editar
    return ['admin', 'gerente', 'facturador'].includes(currentUser.role);
  };

  /**
   * Verifica si el usuario tiene permiso para eliminar entidades
   * @returns {boolean} true si tiene permiso, false en caso contrario
   */
  const canDelete = () => {
    if (!currentUser || !currentUser.role) return false;
    
    // Solo admin y gerente pueden eliminar
    return ['admin', 'gerente'].includes(currentUser.role);
  };

  /**
   * Verifica si el usuario tiene permiso para acceder a configuración avanzada
   * @returns {boolean} true si tiene permiso, false en caso contrario
   */
  const canAccessAdvancedSettings = () => {
    if (!currentUser || !currentUser.role) return false;
    
    // Solo admin y gerente pueden acceder a configuración avanzada
    return ['admin', 'gerente'].includes(currentUser.role);
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - El rol a verificar
   * @returns {boolean} true si tiene el rol, false en caso contrario
   */
  const hasRole = (role) => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role === role;
  };

  return {
    canEdit,
    canDelete,
    canAccessAdvancedSettings,
    hasRole,
    userRole: currentUser?.role || 'guest'
  };
};

export default useRoleAccess;