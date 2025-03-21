import React from 'react';
import { Chip, Tooltip } from '@mui/material';

/**
 * Componente para mostrar el estado de una factura como un chip con color
 * @param {string} status - Estado de la factura: 'draft', 'pending', 'paid', etc.
 * @param {function} onClick - Función para manejar clic (opcional)
 * @param {object} props - Props adicionales para el componente Chip
 */
export const StatusChip = ({ status, onClick, ...props }) => {
  // Función para obtener la etiqueta según el estado
  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'pending':
        return 'Pendiente';
      case 'paid':
        return 'Pagada';
      case 'cancelled':
        return 'Anulada';
      case 'overdue':
        return 'Vencida';
      case 'partial':
        return 'Pago Parcial';
      default:
        return 'Borrador';
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'overdue':
        return 'error';
      case 'partial':
        return 'info';
      default:
        return 'default';
    }
  };

  const label = getStatusLabel(status || 'draft');
  const color = getStatusColor(status || 'draft');

  // Si hay un onClick, envolver en Tooltip
  if (onClick) {
    return (
      <Tooltip title="Haga clic para cambiar el estado">
        <Chip
          label={label}
          color={color}
          size="small"
          onClick={onClick}
          sx={{ cursor: 'pointer', ...props.sx }}
          {...props}
        />
      </Tooltip>
    );
  }

  // Sin onClick, solo mostrar el chip
  return (
    <Chip
      label={label}
      color={color}
      size="small"
      sx={props.sx}
      {...props}
    />
  );
};

export default StatusChip;