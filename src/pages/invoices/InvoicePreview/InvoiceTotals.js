// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

export const InvoiceTotals = ({ invoice, theme = {} }) => {
  if (!invoice) return null;
  
  // Asegurarnos de tener los items
  const items = invoice.items || [];
  console.log('Calculando totales para items:', items);
  
  // Calcular subtotal
  const subtotal = items.reduce((sum, item) => {
    const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
    const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : 0;
    return sum + (cantidad * precio);
  }, 0);
  
  // Calcular IVA (16%) solo para items no exentos
  const iva = items.reduce((sum, item) => {
    if (item.exentoIva !== true) {
      const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
      const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : 0;
      return sum + ((cantidad * precio) * 0.16);
    }
    return sum;
  }, 0);
  
  // Total
  const total = subtotal + iva;
  
  console.log('Totales calculados:', { subtotal, iva, total });
  
  // Estilos
  const containerStyle = {
    width: '40%',
    marginLeft: 'auto',
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#a7abae',
    borderRadius: '4px'
  };
  
  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  };
  
  const totalRowStyle = {
    ...rowStyle,
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #333',
    fontWeight: 'bold'
  };
  
  return (
    <Box sx={containerStyle} className="invoice-totals">
      <Box sx={rowStyle}>
        <Typography variant="body1">Subtotal:</Typography>
        <Typography variant="body1" className="subtotal-value">
          {invoice.moneda || 'VES'} {subtotal.toFixed(2)}
        </Typography>
      </Box>
      
      <Box sx={rowStyle}>
        <Typography variant="body1">IVA (16%):</Typography>
        <Typography variant="body1" className="iva-value">
          {invoice.moneda || 'VES'} {iva.toFixed(2)}
        </Typography>
      </Box>
      
      <Box sx={totalRowStyle}>
        <Typography variant="body1">Total:</Typography>
        <Typography variant="body1" className="total-value">
          {invoice.moneda || 'VES'} {total.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTotals;