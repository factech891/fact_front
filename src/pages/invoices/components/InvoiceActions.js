// src/pages/invoices/components/InvoiceActions.js (CORREGIDO - Quitar color prop)
import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  FileDownload
} from '@mui/icons-material';
// Importar hook y componente con rutas ajustadas
import { useRoleAccess } from '../../../hooks/useRoleAccess'; // VERIFICA ESTA RUTA
import ActionButton from '../../../components/ActionButton'; // VERIFICA ESTA RUTA

/**
 * Componente para mostrar acciones comunes de facturas (ver, editar, eliminar, descargar)
 * con control de acceso basado en roles y estilo de íconos blanco.
 */
export const InvoiceActions = ({
  invoice,
  onPreview,
  onEdit,
  onDelete,
  onDownload,
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
            // color="info" // Quitar color si queremos blanco por defecto
            size="small"
          >
            <Visibility fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}

      {/* Botón Descargar PDF (ya debería ser blanco por defecto) */}
      {onDownload && (
        <Tooltip title="Descargar PDF">
          <IconButton
            onClick={() => onDownload(invoice)}
            // color="secondary" // Quitar color si queremos blanco por defecto
            size="small"
          >
            <FileDownload fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}

      {/* Botón Editar: Usar ActionButton SIN pasarle color */}
      {onEdit && (
        <ActionButton
          type="edit" // Verifica canEdit()
          onClick={() => onEdit(invoice)}
          tooltipTitle="Editar Factura"
          isIconButton={true}
          showDisabled={true}
          buttonProps={{
            // color: 'primary', // QUITAMOS la prop color
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
            // color: 'error', // QUITAMOS la prop color
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