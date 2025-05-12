// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const InvoiceTotals = ({ invoice, theme = {} }) => {
  if (!invoice) return null;
  
  const isPrintMode = theme.printMode === true;
  
  // Asegurarnos de tener los items
  const items = invoice.items || [];
  
  // Calcular base imponible (sólo items gravables)
  const baseImponible = items.reduce((sum, item) => {
    if (item.exentoIva !== true) {
      const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
      const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : 0;
      return sum + (cantidad * precio);
    }
    return sum;
  }, 0);
  
  // Calcular monto exento (solo items exentos)
  const exento = items.reduce((sum, item) => {
    if (item.exentoIva === true) {
      const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
      const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : 0;
      return sum + (cantidad * precio);
    }
    return sum;
  }, 0);
  
  // Calcular IVA (16%) solo para items no exentos
  const iva = baseImponible * 0.16;
  
  // Total
  const total = baseImponible + exento + iva;
  
  // Función para formatear valores
  const formatCurrency = (value) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Estilos
  const styles = {
    container: {
      width: '40%',
      marginLeft: 'auto',
      marginTop: '20px',
      marginBottom: '20px',
      overflow: 'hidden',
      borderRadius: '6px',
      boxShadow: isPrintMode ? 'none' : '0 2px 8px rgba(0,0,0,0.12)'
    },
    totalsBox: {
      backgroundColor: isPrintMode ? '#ffffff' : (theme.primary || '#003366'),
      padding: '0',
      color: isPrintMode ? '#000000' : '#FFFFFF',
      borderRadius: '6px',
      border: isPrintMode ? '1px solid #000000' : 'none'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 15px',
      alignItems: 'center'
    },
    baseImponibleRow: {
      borderBottom: isPrintMode ? '1px solid #000000' : '1px solid rgba(255,255,255,0.1)'
    },
    exentoRow: {
      borderBottom: isPrintMode ? '1px solid #000000' : '1px solid rgba(255,255,255,0.1)'
    },
    ivaRow: {
      borderBottom: isPrintMode ? '1px solid #000000' : '1px solid rgba(255,255,255,0.1)',
      backgroundColor: isPrintMode ? '#ffffff' : 'rgba(0,0,0,0.05)'
    },
    totalRow: {
      backgroundColor: isPrintMode ? '#ffffff' : 'rgba(0,0,0,0.1)',
      padding: '15px',
      borderTop: isPrintMode ? '2px solid #000000' : 'none'
    },
    label: {
      fontWeight: '500',
      fontSize: '14px'
    },
    value: {
      fontWeight: '600',
      fontSize: '14px',
      fontFamily: '"Roboto Mono", monospace'
    },
    totalLabel: {
      fontWeight: '600',
      fontSize: '16px'
    },
    totalValue: {
      fontWeight: '700',
      fontSize: '16px',
      fontFamily: '"Roboto Mono", monospace'
    }
  };
  
  return (
    <Box sx={styles.container} className="invoice-totals">
      <Paper elevation={0} sx={styles.totalsBox}>
        {/* Base Imponible */}
        <Box sx={{...styles.row, ...styles.baseImponibleRow}}>
          <Typography sx={styles.label}>Base Imponible:</Typography>
          <Typography sx={styles.value} className="base-imponible-value">
            {invoice.moneda || 'VES'} {formatCurrency(baseImponible)}
          </Typography>
        </Box>
        
        {/* Exento */}
        <Box sx={{...styles.row, ...styles.exentoRow}}>
          <Typography sx={styles.label}>Exento:</Typography>
          <Typography sx={styles.value} className="exento-value">
            {invoice.moneda || 'VES'} {formatCurrency(exento)}
          </Typography>
        </Box>
        
        {/* IVA */}
        <Box sx={{...styles.row, ...styles.ivaRow}}>
          <Typography sx={styles.label}>IVA (16%):</Typography>
          <Typography sx={styles.value} className="iva-value">
            {invoice.moneda || 'VES'} {formatCurrency(iva)}
          </Typography>
        </Box>
        
        {/* Total */}
        <Box sx={{...styles.row, ...styles.totalRow}}>
          <Typography sx={styles.totalLabel}>Total:</Typography>
          <Typography sx={styles.totalValue} className="total-value">
            {invoice.moneda || 'VES'} {formatCurrency(total)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoiceTotals;