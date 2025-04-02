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
  
  // Estilos para la tabla
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
    // Estilos para el encabezado
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
    // Estilos para las celdas
    cell: {
      padding: '10px 8px',
      borderBottom: '1px solid #eaeaea',
      color: '#333',
      fontSize: '13px',
      fontWeight: '400'
    },
    // Estilos para filas alternas
    evenRow: {
      backgroundColor: '#f9f9f9',
    },
    oddRow: {
      backgroundColor: '#FFFFFF',
    },
    // Estilos para la columna de exento
    exentoColumn: {
      width: '120px',
      textAlign: 'center'
    },
    // Estilos para las etiquetas de exento/no exento
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
      backgroundColor: '#4caf50',
      color: 'white'
    },
    exentoFalse: {
      backgroundColor: '#f44336',
      color: 'white'
    },
    // Estilos para columnas numéricas
    numeric: {
      textAlign: 'right',
      fontFamily: '"Roboto Mono", monospace'
    },
    // Estilos para la columna de cantidad
    quantity: {
      textAlign: 'center',
      width: '80px'
    },
    // Estilos para la columna de código
    code: {
      width: '100px',
      fontFamily: '"Roboto Mono", monospace',
      fontSize: '12px'
    }
  };
  
  // Formatear valores numéricos
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const formatQuantity = (value) => {
    if (typeof value !== 'number') return '1.00';
    return value.toFixed(2);
  };
  
  // Calcular el total de cada ítem
  const calculateItemTotal = (item) => {
    const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
    const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : 0;
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
            {items.map((item, index) => (
              <TableRow 
                key={index} 
                sx={index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow}
              >
                <TableCell sx={{ ...tableStyles.cell, ...tableStyles.code }}>
                  {item.codigo || ''}
                </TableCell>
                <TableCell sx={{ ...tableStyles.cell }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.descripcion || ''}
                  </Typography>
                </TableCell>
                <TableCell sx={{ ...tableStyles.cell, ...tableStyles.quantity }}>
                  {formatQuantity(item.cantidad)}
                </TableCell>
                <TableCell sx={{ ...tableStyles.cell, ...tableStyles.numeric }}>
                  {moneda} {formatCurrency(item.precioUnitario)}
                </TableCell>
                <TableCell sx={{ ...tableStyles.cell, ...tableStyles.numeric }}>
                  {moneda} {formatCurrency(calculateItemTotal(item))}
                </TableCell>
                <TableCell sx={{ ...tableStyles.cell, ...tableStyles.exentoColumn }}>
                  <Box 
                    sx={{ 
                      ...tableStyles.exentoTag, 
                      ...(item.exentoIva ? tableStyles.exentoTrue : tableStyles.exentoFalse)
                    }}
                  >
                    {item.exentoIva ? 'EXENTO' : 'NO'}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvoiceItemsTable;