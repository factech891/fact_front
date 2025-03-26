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
  
  // Estilos mejorados
  const containerStyle = {
    width: '40%',
    marginLeft: 'auto',
    marginTop: '20px',
    padding: '15px',
    // Usar un color de fondo más oscuro para mejorar contraste
    backgroundColor: theme.primary || '#003366', // Color primario del tema o azul oscuro
    borderRadius: '4px',
    color: '#FFFFFF' // Texto blanco para mejor contraste
  };
  
  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  };
  
  const valueStyle = {
    fontWeight: 'bold',
    color: '#FFFFFF' // Asegurar que los valores sean blancos
  };
  
  const totalRowStyle = {
    ...rowStyle,
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.4)', // Borde más claro
    fontWeight: 'bold'
  };
  
  return (
    <Box sx={containerStyle} className="invoice-totals">
      <Box sx={rowStyle}>
        <Typography variant="body1">Subtotal:</Typography>
        <Typography variant="body1" sx={valueStyle} className="subtotal-value">
          {invoice.moneda || 'VES'} {subtotal.toFixed(2)}
        </Typography>
      </Box>
      
      <Box sx={rowStyle}>
        <Typography variant="body1">IVA (16%):</Typography>
        <Typography variant="body1" sx={valueStyle} className="iva-value">
          {invoice.moneda || 'VES'} {iva.toFixed(2)}
        </Typography>
      </Box>
      
      <Box sx={totalRowStyle}>
        <Typography variant="body1">Total:</Typography>
        <Typography variant="body1" sx={valueStyle} className="total-value">
          {invoice.moneda || 'VES'} {total.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTotals;