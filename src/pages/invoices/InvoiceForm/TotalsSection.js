import React from 'react';
// src/pages/invoices/InvoiceForm/TotalsSection.js
import { Box, Typography } from '@mui/material';
import { formatCurrency } from '../utils/formatters';

const TotalsSection = ({ subtotal, tax, total, moneda }) => {
  return (
    <Box sx={{ 
      mt: 2, 
      mb: 2,
      display: 'flex', 
      justifyContent: 'flex-end'
    }}>
      <Box sx={{ 
        backgroundColor: '#1E1E1E', 
        borderRadius: '4px',
        p: 2,
        minWidth: '300px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e7'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 1
        }}>
          <Typography variant="body1" color="text.secondary">
            Subtotal:
          </Typography>
          <Typography variant="body1" fontFamily="monospace" textAlign="right">
            {moneda} {formatCurrency(subtotal)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 1
        }}>
          <Typography variant="body1" color="text.secondary">
            IVA (16%):
          </Typography>
          <Typography variant="body1" fontFamily="monospace" textAlign="right">
            {moneda} {formatCurrency(tax)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pt: 1,
          mt: 1,
          borderTop: '1px solid #e0e0e7'
        }}>
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
            Total:
          </Typography>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {moneda} {formatCurrency(total)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TotalsSection;