// src/hooks/useRoleAccess.js (CORREGIDO)
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para verificar permisos basados en roles
 * @returns Objeto con funciones para verificar permisos
 */
export const useRoleAccess = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role?.toLowerCase() || 'guest'; // Normalizar a minúsculas

  /**
   * Verifica si el usuario tiene permiso para CREAR nuevas entidades
   * @returns {boolean} true si tiene permiso, false en caso contrario
   */
  const canCreate = () => {
    if (!currentUser || !currentUser.role) return false;
    // Admin, gerente/manager y facturador pueden crear
    return ['admin', 'gerente', 'manager', 'facturador'].includes(userRole);
  };

  /**
   * Verifica si el usuario tiene permiso para EDITAR entidades existentes
   * @returns {boolean} true si tiene permiso, false en caso contrario
   */
  const canEdit = () => {
    if (!currentUser || !currentUser.role) return false;
    // El rol "visor" solo puede ver, no editar
    if (userRole === 'visor') return false;
    // Otros roles (admin, gerente/manager, facturador) pueden editar
    return ['admin', 'gerente', 'manager', 'facturador'].includes(userRole);
  };

  /**
   * Verifica si el usuario tiene permiso para ELIMINAR entidades
   * @returns {boolean} true si tiene permiso, false en caso contrario
   */
  const canDelete = () => {
    if (!currentUser || !currentUser.role) return false;
    // Admin, gerente/manager pueden eliminar
    return ['admin', 'gerente', 'manager'].includes(userRole);
  };

  /**
   * Verifica si el usuario tiene permiso para acceder a configuración avanzada
   * @returns {boolean} true si tiene permiso, false en caso contrario
   */
  const canAccessAdvancedSettings = () => {
    if (!currentUser || !currentUser.role) return false;
    // Admin y gerente/manager pueden acceder a configuración avanzada
    return ['admin', 'gerente', 'manager'].includes(userRole);
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - El rol a verificar (se compara en minúsculas)
   * @returns {boolean} true si tiene el rol, false en caso contrario
   */
  const hasRole = (role) => {
    if (!currentUser || !currentUser.role) return false;
    return userRole === role.toLowerCase();
  };

  return {
    canCreate, // Exportar la nueva función
    canEdit,
    canDelete,
    canAccessAdvancedSettings,
    hasRole,
    userRole: userRole // Devolver el rol normalizado
  };
};

export default useRoleAccess;