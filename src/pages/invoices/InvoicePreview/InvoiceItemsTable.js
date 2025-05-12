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

  const isPrintMode = theme.printMode === true;

  const tableStyles = {
    root: {
      width: '100%',
      marginTop: '25px',
      marginBottom: '30px',
      borderCollapse: 'collapse',
      borderRadius: '6px',
      overflow: 'hidden',
      boxShadow: isPrintMode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
      border: isPrintMode ? '1px solid #000000' : 'none',
    },
    header: {
      backgroundColor: isPrintMode ? '#ffffff' : (theme.primary || '#003366'),
      '& th': {
        color: isPrintMode ? '#000000' : '#FFFFFF',
        padding: '12px 15px', 
        fontWeight: '600',
        fontSize: '14px', 
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textAlign: 'left',
        borderBottom: isPrintMode ? '1px solid #000000' : 'none',
        whiteSpace: 'nowrap' 
      }
    },
    cell: {
      padding: '10px 8px',
      borderBottom: isPrintMode ? '1px solid #000000' : '1px solid #eaeaea',
      color: theme.text?.primary || '#333333',
      fontSize: '13px',
      fontWeight: '400'
    },
    evenRow: {
      backgroundColor: isPrintMode ? '#ffffff' : (theme.background?.secondary || '#f9f9f9'),
    },
    oddRow: {
      backgroundColor: theme.background?.primary || '#FFFFFF',
    },
    exentoColumn: {
      width: '120px', 
      textAlign: 'center'
    },
    exentoTag: { 
      padding: '6px 12px',
      borderRadius: '4px',
      fontWeight: '500',
      fontSize: '12px',
      display: 'inline-block',
      width: 'auto',
      minWidth: '80px',
      textAlign: 'center',
      boxShadow: isPrintMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
    },
    exentoTrue: { 
      backgroundColor: isPrintMode ? '#ffffff' : (theme.success || '#4caf50'),
      color: isPrintMode ? '#000000' : 'white',
      border: isPrintMode ? '1px solid #000000' : 'none'
    },
    exentoFalse: { 
      backgroundColor: isPrintMode ? '#ffffff' : (theme.error || '#f44336'),
      color: isPrintMode ? '#000000' : 'white',
      border: isPrintMode ? '1px solid #000000' : 'none'
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

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatQuantity = (value) => {
    if (typeof value !== 'number') return '1.00';
    return value.toFixed(2);
  };

  const calculateItemTotal = (item) => {
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
              <TableCell sx={{ ...tableStyles.exentoColumn, width: '10%' }}>TIPO FISCAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              const isExempt = item.exentoIva === true || item.taxExempt === true;
              const quantity = item.cantidad ?? item.quantity ?? 1;
              const unitPrice = item.precioUnitario ?? item.price ?? 0;
              const itemTotal = calculateItemTotal({ cantidad: quantity, precioUnitario: unitPrice });

              return (
                <TableRow
                  key={item.product || item._id || index}
                  sx={index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow}
                >
                  <TableCell sx={{ ...tableStyles.cell, ...tableStyles.code }}>
                    {item.codigo || ''}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell }}>
                    <Typography variant="body2" sx={{
                        fontWeight: 500,
                        color: theme.text?.primary || '#333333'
                      }}
                    >
                      {item.descripcion || item.nombre || ''}
                    </Typography>
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
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '12px',
                        color: isPrintMode ? '#000000' : 'white',
                        backgroundColor: isPrintMode ? '#ffffff' : (theme.primary || '#003366'),
                        border: isPrintMode ? '1px solid #000000' : 'none',
                        display: 'inline-block',
                        width: 'auto',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}
                    >
                      {isExempt ? 'Exento' : 'Gravado'}
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