// src/pages/invoices/InvoicePreview/InvoiceItemsTable.js
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';

export const InvoiceItemsTable = ({ items = [], moneda = 'VES', theme = {} }) => {
  if (!items || items.length === 0) return null;

  // Estilos para la tabla (sin cambios)
  const tableStyles = {
    root: {
      width: '100%',
      marginTop: '25px',
      marginBottom: '30px',
      borderCollapse: 'collapse',
      borderRadius: '6px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    header: {
      backgroundColor: theme.primary || '#003366',
      '& th': {
        color: '#FFFFFF',
        padding: '12px 8px',
        fontWeight: '600',
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textAlign: 'left',
        borderBottom: 'none'
      }
    },
    cell: {
      padding: '10px 8px',
      borderBottom: '1px solid #eaeaea',
      color: theme.text?.primary || '#333333', // Usar color primario del tema o fallback
      fontSize: '13px',
      fontWeight: '400'
    },
    evenRow: {
      backgroundColor: theme.background?.secondary || '#f9f9f9', // Usar color secundario del tema o fallback
    },
    oddRow: {
      backgroundColor: theme.background?.primary || '#FFFFFF', // Usar color primario del tema o fallback
    },
    exentoColumn: {
      width: '120px',
      textAlign: 'center'
    },
    exentoTag: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '11px',
      display: 'inline-block',
      width: '80px',
      textAlign: 'center',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    exentoTrue: {
      backgroundColor: theme.success || '#4caf50', // Usar color de éxito del tema o fallback
      color: 'white'
    },
    exentoFalse: {
      backgroundColor: theme.error || '#f44336', // Usar color de error del tema o fallback
      color: 'white'
    },
    numeric: {
      textAlign: 'right',
      fontFamily: '"Roboto Mono", monospace'
    },
    quantity: {
      textAlign: 'center',
      width: '80px'
    },
    code: {
      width: '100px',
      fontFamily: '"Roboto Mono", monospace',
      fontSize: '12px'
    }
  };

  // Formatear valores numéricos (sin cambios)
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatQuantity = (value) => {
    if (typeof value !== 'number') return '1.00';
    return value.toFixed(2);
  };

  // Calcular el total de cada ítem (sin cambios)
  const calculateItemTotal = (item) => {
    // Usar ?? para manejar valores 0 correctamente
    const cantidad = item.cantidad ?? item.quantity ?? 1;
    const precio = item.precioUnitario ?? item.price ?? 0;
    return cantidad * precio;
  };

  return (
    <Box sx={{ marginY: 3 }}>
      <TableContainer component={Paper} elevation={0} className="invoice-items-table"
        sx={{ ...tableStyles.root, backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow sx={tableStyles.header}>
              <TableCell sx={{ width: '15%' }}>Código</TableCell>
              <TableCell sx={{ width: '35%' }}>Descripción</TableCell>
              <TableCell sx={{ ...tableStyles.quantity, width: '10%' }}>Cantidad</TableCell>
              <TableCell sx={{ ...tableStyles.numeric, width: '15%' }}>Precio Unit.</TableCell>
              <TableCell sx={{ ...tableStyles.numeric, width: '15%' }}>Total</TableCell>
              <TableCell sx={{ ...tableStyles.exentoColumn, width: '10%' }}>Exento IVA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              // Determinar si la propiedad de exento es 'exentoIva' o 'taxExempt'
              const isExempt = item.exentoIva === true || item.taxExempt === true;
              // Obtener cantidad y precio usando ?? para manejar diferentes nombres de propiedad y valores 0
              const quantity = item.cantidad ?? item.quantity ?? 1;
              const unitPrice = item.precioUnitario ?? item.price ?? 0;
              const itemTotal = calculateItemTotal({ cantidad: quantity, precioUnitario: unitPrice });

              return (
                <TableRow
                  key={item.product || item._id || index} // Usar ID si está disponible
                  sx={index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow}
                >
                  <TableCell sx={{ ...tableStyles.cell, ...tableStyles.code }}>
                    {item.codigo || ''}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell }}>
                    {/* --- MODIFICACIÓN AQUÍ --- */}
                    <Typography variant="body2" sx={{
                        fontWeight: 500,
                        // Asegurar que el color sea el primario del texto definido en el tema
                        color: theme.text?.primary || '#333333'
                      }}
                    >
                      {item.descripcion || item.nombre || ''} {/* Usar 'nombre' como fallback */}
                    </Typography>
                    {/* --- FIN MODIFICACIÓN --- */}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, ...tableStyles.quantity }}>
                    {formatQuantity(quantity)}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, ...tableStyles.numeric }}>
                    {moneda} {formatCurrency(unitPrice)}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, ...tableStyles.numeric }}>
                    {moneda} {formatCurrency(itemTotal)}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, ...tableStyles.exentoColumn }}>
                    <Box
                      sx={{
                        ...tableStyles.exentoTag,
                        ...(isExempt ? tableStyles.exentoTrue : tableStyles.exentoFalse)
                      }}
                    >
                      {isExempt ? 'EXENTO' : 'NO'}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvoiceItemsTable;