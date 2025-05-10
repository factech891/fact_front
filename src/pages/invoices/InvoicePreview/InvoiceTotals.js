// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const InvoiceTotals = ({ invoice, theme = {} }) => {
  if (!invoice) return null;
  
  // Asegurarnos de tener los items
  const items = invoice.items || [];
  
  // Calcular subtotal (que ahora se etiquetará como Base Imponible)
  const subtotal = items.reduce((sum, item) => {
    const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
    const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : 0;
    return sum + (cantidad * precio);
  }, 0);
  
  // Calcular IVA (16%) solo para items no exentos
  const iva = items.reduce((sum, item) => {
    // Asumimos que si item.exentoIva no es true, es gravable.
    // Si hay una propiedad taxType === 'gravado' o similar, sería más explícito.
    if (item.exentoIva !== true) { 
      const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
      const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : 0;
      return sum + ((cantidad * precio) * 0.16);
    }
    return sum;
  }, 0);
  
  // Total
  const total = subtotal + iva;
  
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
    },
    totalsBox: {
      backgroundColor: theme.primary || '#003366',
      padding: '0',
      color: '#FFFFFF',
      borderRadius: '6px'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 15px',
      alignItems: 'center'
    },
    subtotalRow: { // Esta clase de estilo ahora corresponde a "Base Imponible"
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    ivaRow: {
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(0,0,0,0.05)'
    },
    totalRow: {
      backgroundColor: 'rgba(0,0,0,0.1)',
      padding: '15px'
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
        {/* Modificación: Cambiar el texto de "Subtotal" a "Base Imponible" */}
        <Box sx={{...styles.row, ...styles.subtotalRow}}>
          <Typography sx={styles.label}>Base Imponible:</Typography>
          <Typography sx={styles.value} className="subtotal-value"> {/* La clase CSS se mantiene como subtotal-value por si se usa en otro lado */}
            {invoice.moneda || 'VES'} {formatCurrency(subtotal)}
          </Typography>
        </Box>
        
        <Box sx={{...styles.row, ...styles.ivaRow}}>
          <Typography sx={styles.label}>IVA (16%):</Typography>
          <Typography sx={styles.value} className="iva-value">
            {invoice.moneda || 'VES'} {formatCurrency(iva)}
          </Typography>
        </Box>
        
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