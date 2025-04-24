// src/components/ActionButton.js
import React from 'react';
import { Button, Tooltip, IconButton } from '@mui/material';
import { useRoleAccess } from '../hooks/useRoleAccess';

/**
 * Componente que renderiza un botón de acción solo si el usuario tiene los permisos adecuados
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de acción ('edit', 'delete', 'create', 'advanced')
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 * @param {string} props.tooltipTitle - Título del tooltip (opcional)
 * @param {boolean} props.showDisabled - Mostrar botón deshabilitado en lugar de ocultarlo (opcional)
 * @param {Object} props.buttonProps - Propiedades adicionales para el botón (opcional)
 * @param {boolean} props.isIconButton - Si es un IconButton en lugar de Button (opcional)
 * @returns {React.ReactElement|null} Botón o null si no tiene permisos
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
  const { canEdit, canDelete, canAccessAdvancedSettings } = useRoleAccess();
  
  // Determinar si el usuario tiene permiso para esta acción
  const hasPermission = () => {
    switch (type) {
      case 'edit':
      case 'create':
        return canEdit();
      case 'delete':
        return canDelete();
      case 'advanced':
        return canAccessAdvancedSettings();
      default:
        return true; // Para acciones genéricas, permitir por defecto
    }
  };
  
  // Si no tiene permiso y no queremos mostrar el botón deshabilitado, no renderizar nada
  if (!hasPermission() && !showDisabled) {
    return null;
  }
  
  // Mensajes para tooltip cuando está deshabilitado
  const getDisabledTooltip = () => {
    if (hasPermission()) return tooltipTitle;
    
    switch (type) {
      case 'edit':
      case 'create':
        return 'No tienes permisos para editar. Vista de solo lectura.';
      case 'delete':
        return 'Solo administradores y gerentes pueden eliminar elementos.';
      case 'advanced':
        return 'Configuración avanzada no disponible para tu rol.';
      default:
        return 'No tienes permisos para esta acción.';
    }
  };
  
  // Renderizar el botón con Tooltip
  const buttonElement = isIconButton ? (
    <IconButton
      onClick={hasPermission() ? onClick : undefined}
      disabled={!hasPermission()}
      {...buttonProps}
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
  
  // Envolver con Tooltip si hay un título
  return tooltipTitle || !hasPermission() ? (
    <Tooltip title={getDisabledTooltip()}>
      <span>{buttonElement}</span>
    </Tooltip>
  ) : (
    buttonElement
  );
};

export default ActionButton;