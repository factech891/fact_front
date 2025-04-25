// src/components/InvoiceActions.js (CORREGIDO)
import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  FileDownload
} from '@mui/icons-material';
// Importar el hook de acceso por rol y el componente ActionButton
import { useRoleAccess } from '../hooks/useRoleAccess'; // Ajusta la ruta si es necesario (ej. ../hooks/useRoleAccess)
import ActionButton from './ActionButton'; // Ajusta la ruta si es necesario (ej. ./ActionButton)

/**
 * Componente para mostrar acciones comunes de facturas (ver, editar, eliminar, descargar)
 * con control de acceso basado en roles.
 * @param {object} invoice - Datos de la factura
 * @param {function} onPreview - Función para previsualizar la factura
 * @param {function} onEdit - Función para editar la factura
 * @param {function} onDelete - Función para eliminar la factura
 * @param {function} onDownload - Función para descargar la factura como PDF
 * @param {object} props - Props adicionales (ej. sx para estilos)
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

  // Determinar si alguna acción de edición o borrado está disponible
  // (para decidir si mostrar el componente en absoluto, aunque ActionButton maneja la visibilidad individual)
  // Esto es opcional, podrías simplemente dejar que ActionButton oculte los botones individualmente.
  // const hasAnyAction = onPreview || onDownload || (onEdit && canEdit()) || (onDelete && canDelete());
  // if (!hasAnyAction) return null; // Opcional: Ocultar todo el Box si no hay acciones visibles

  return (
    <Box sx={{ display: 'flex', gap: '4px', ...props.sx }}>
      {/* Botón Ver: Asumimos que todos los que ven la tabla pueden previsualizar */}
      {onPreview && (
        <Tooltip title="Previsualizar">
          <IconButton
            onClick={() => onPreview(invoice)}
            color="info"
            size="small"
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Botón Descargar PDF: Asumimos que todos los que ven la tabla pueden descargar */}
      {onDownload && (
        <Tooltip title="Descargar PDF">
          <IconButton
            onClick={() => onDownload(invoice)}
            color="secondary"
            size="small"
          >
            <FileDownload fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Botón Editar: Usar ActionButton para control de permisos */}
      {onEdit && ( // Solo intentar renderizar si se proporcionó onEdit
        <ActionButton
          type="edit" // Verifica canEdit()
          onClick={() => onEdit(invoice)}
          tooltipTitle="Editar Factura"
          isIconButton={true}
          showDisabled={true} // Mostrar deshabilitado si no tiene permiso
          buttonProps={{
            color: 'primary',
            size: 'small',
            // Podrías añadir disabled={algunaCondicionDeFactura} si fuera necesario
          }}
        >
          <Edit fontSize="small" />
        </ActionButton>
      )}

      {/* Botón Eliminar: Usar ActionButton para control de permisos */}
      {onDelete && ( // Solo intentar renderizar si se proporcionó onDelete
        <ActionButton
          type="delete" // Verifica canDelete()
          onClick={() => onDelete(invoice._id)}
          tooltipTitle="Eliminar Factura"
          isIconButton={true}
          showDisabled={true} // Mostrar deshabilitado si no tiene permiso
          buttonProps={{
            color: 'error',
            size: 'small',
             // Podrías añadir disabled={algunaCondicionDeFactura} si fuera necesario
          }}
        >
          <Delete fontSize="small" />
        </ActionButton>
      )}
    </Box>
  );
};

export default InvoiceActions;