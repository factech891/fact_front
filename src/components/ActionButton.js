// src/components/ActionButton.js (CORREGIDO)
import React from 'react';
import { Button, Tooltip, IconButton } from '@mui/material';
import { useRoleAccess } from '../hooks/useRoleAccess'; // Asegúrate que la ruta sea correcta

/**
 * Componente que renderiza un botón de acción solo si el usuario tiene los permisos adecuados
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de acción ('edit', 'delete', 'create', 'advanced', u otro genérico)
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 * @param {string} props.tooltipTitle - Título del tooltip (opcional)
 * @param {boolean} props.showDisabled - Mostrar botón deshabilitado en lugar de ocultarlo (opcional)
 * @param {Object} props.buttonProps - Propiedades adicionales para el botón (opcional)
 * @param {boolean} props.isIconButton - Si es un IconButton en lugar de Button (opcional)
 * @returns {React.ReactElement|null} Botón o null si no tiene permisos y showDisabled es false
 */
const ActionButton = ({
  type,
  children,
  onClick,
  tooltipTitle,
  showDisabled = false,
  buttonProps = {},
  isIconButton = false
}) => {
  // Importar las funciones de permiso necesarias, incluyendo la nueva canCreate
  const { canCreate, canEdit, canDelete, canAccessAdvancedSettings } = useRoleAccess();

  // Determinar si el usuario tiene permiso para esta acción específica
  const hasPermission = () => {
    switch (type) {
      case 'create': // Usar la nueva función para 'create'
        return canCreate();
      case 'edit':
        return canEdit();
      case 'delete':
        return canDelete();
      case 'advanced':
        return canAccessAdvancedSettings();
      default:
        // Para acciones no específicas de CRUD o avanzadas, permitir por defecto
        // o podrías añadir más casos si tienes otros tipos de acciones con permisos
        return true;
    }
  };

  // Si no tiene permiso y no se debe mostrar deshabilitado, retornar null
  if (!hasPermission() && !showDisabled) {
    return null;
  }

  // Mensajes para tooltip cuando el botón está deshabilitado por falta de permisos
  const getDisabledTooltip = () => {
    // Si tiene permiso, usar el tooltip normal provisto
    if (hasPermission()) return tooltipTitle;

    // Si no tiene permiso, mostrar un mensaje específico del tipo de acción
    switch (type) {
      case 'create':
        return 'No tienes permisos para crear nuevos elementos.'; // Mensaje específico para crear
      case 'edit':
        return 'No tienes permisos para editar. Vista de solo lectura.';
      case 'delete':
        return 'Solo administradores y gerentes pueden eliminar elementos.';
      case 'advanced':
        return 'Configuración avanzada no disponible para tu rol.';
      default:
        return 'No tienes permisos para realizar esta acción.';
    }
  };

  // Crear el elemento botón (Button o IconButton)
  const buttonElement = isIconButton ? (
    <IconButton
      onClick={hasPermission() ? onClick : undefined} // Solo asignar onClick si tiene permiso
      disabled={!hasPermission()} // Deshabilitar si no tiene permiso
      {...buttonProps} // Aplicar props adicionales
    >
      {children}
    </IconButton>
  ) : (
    <Button
      onClick={hasPermission() ? onClick : undefined}
      disabled={!hasPermission()}
      {...buttonProps}
    >
      {children}
    </Button>
  );

  // Determinar si se necesita Tooltip (si se proveyó un título o si está deshabilitado)
  const needsTooltip = tooltipTitle || !hasPermission();

  // Envolver con Tooltip si es necesario.
  // El <span> es importante para que Tooltip funcione correctamente con botones deshabilitados.
  return needsTooltip ? (
    <Tooltip title={getDisabledTooltip() || ''}>
      <span>{buttonElement}</span>
    </Tooltip>
  ) : (
    buttonElement // Renderizar solo el botón si no necesita tooltip
  );
};

export default ActionButton;