import React from 'react';
import { Typography } from '@mui/material';

/**
 * Componente para formatear y mostrar valores monetarios
 * @param {number} value - Valor numérico a formatear
 * @param {string} currency - Código de moneda (USD, VES, etc.)
 * @param {object} typographyProps - Props para el componente Typography
 * @param {object} props - Props adicionales
 */
export const CurrencyFormat = ({ 
  value, 
  currency = 'USD', 
  typographyProps = {}, 
  ...props 
}) => {
  // Función para formatear el número con separadores de miles y decimales
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value) || 0);
  };

  return (
    <Typography {...typographyProps} {...props}>
      {currency} {formatCurrency(value)}
    </Typography>
  );
};

// Variante con estilo monoespaciado para tablas y totales
export const MonospaceCurrencyFormat = ({ 
  value, 
  currency = 'USD', 
  typographyProps = {}, 
  ...props 
}) => {
  return (
    <CurrencyFormat
      value={value}
      currency={currency}
      typographyProps={{
        ...typographyProps,
        fontFamily: 'monospace',
        sx: {
          ...typographyProps.sx,
          textAlign: 'right'
        }
      }}
      {...props}
    />
  );
};

export default CurrencyFormat;