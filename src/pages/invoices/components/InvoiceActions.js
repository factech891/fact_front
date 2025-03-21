import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { 
  Visibility, 
  Edit, 
  Delete, 
  FileDownload 
} from '@mui/icons-material';

/**
 * Componente para mostrar acciones comunes de facturas (ver, editar, eliminar, descargar)
 * @param {object} invoice - Datos de la factura
 * @param {function} onPreview - Función para previsualizar la factura
 * @param {function} onEdit - Función para editar la factura
 * @param {function} onDelete - Función para eliminar la factura
 * @param {function} onDownload - Función para descargar la factura como PDF
 * @param {object} props - Props adicionales
 */
export const InvoiceActions = ({ 
  invoice, 
  onPreview, 
  onEdit, 
  onDelete, 
  onDownload,
  ...props 
}) => {
  return (
    <Box sx={{ display: 'flex', gap: '4px', ...props.sx }}>
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
      
      {onEdit && (
        <Tooltip title="Editar">
          <IconButton 
            onClick={() => onEdit(invoice)} 
            color="primary" 
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      
      {onDelete && (
        <Tooltip title="Eliminar">
          <IconButton 
            onClick={() => onDelete(invoice._id)} 
            color="error" 
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default InvoiceActions;