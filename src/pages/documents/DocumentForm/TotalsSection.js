// src/pages/documents/DocumentForm/TotalsSection.js
import React from 'react';
import { Box, Typography, Grid, Divider, Paper } from '@mui/material';

const TotalsSection = ({ formData, onFieldChange }) => {
  // Usar el enfoque simple para formatear moneda
  const formatCurrency = (amount, currency) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Totales
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography>
              {formData.currency} {formData.subtotal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>IVA (16%):</Typography>
            <Typography>
              {formData.currency} {formData.taxAmount.toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {formData.currency} {formData.total.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default TotalsSection;