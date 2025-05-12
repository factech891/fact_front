// src/pages/invoices/components/InvoiceActions.js
import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import {
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
// Importar hook y componente con rutas ajustadas
import { useRoleAccess } from '../../../hooks/useRoleAccess'; // VERIFICA ESTA RUTA
import ActionButton from '../../../components/ActionButton'; // VERIFICA ESTA RUTA

/**
 * Componente para mostrar acciones comunes de facturas (ver, editar, eliminar)
 * con control de acceso basado en roles y estilo de íconos blanco.
 */
export const InvoiceActions = ({
  invoice,
  onPreview,
  onEdit,
  onDelete,
  onDownload, // Mantenemos el prop aunque no lo usemos para evitar errores
  ...props
}) => {
  // Obtener funciones de permiso del hook
  const { canEdit, canDelete } = useRoleAccess();

  return (
    <Box sx={{ display: 'flex', gap: '4px', ...props.sx }}>
      {/* Botón Ver (ya debería ser blanco por defecto) */}
      {onPreview && (
        <Tooltip title="Previsualizar">
          <IconButton
            onClick={() => onPreview(invoice)}
            size="small"
          >
            <Visibility fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}

      {/* El botón de descargar PDF ha sido eliminado */}

      {/* Botón Editar: Usar ActionButton SIN pasarle color */}
      {onEdit && (
        <ActionButton
          type="edit" // Verifica canEdit()
          onClick={() => onEdit(invoice)}
          tooltipTitle="Editar Factura"
          isIconButton={true}
          showDisabled={true}
          buttonProps={{
            size: 'small',
          }}
        >
          <Edit fontSize="inherit" /> {/* Ícono directo */}
        </ActionButton>
      )}

      {/* Botón Eliminar: Usar ActionButton SIN pasarle color */}
      {onDelete && (
        <ActionButton
          type="delete" // Verifica canDelete()
          onClick={() => onDelete(invoice._id)}
          tooltipTitle="Eliminar Factura"
          isIconButton={true}
          showDisabled={true}
          buttonProps={{
            size: 'small',
          }}
        >
           <Delete fontSize="inherit" /> {/* Ícono directo */}
        </ActionButton>
      )}
    </Box>
  );
};

export default InvoiceActions;