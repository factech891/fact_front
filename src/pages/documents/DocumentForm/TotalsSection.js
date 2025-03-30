// src/pages/documents/DocumentForm/TotalsSection.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Divider // Aseguramos que Divider esté importado
} from '@mui/material';

const TotalsSection = ({ formData, onFieldChange }) => {
  // Formatear moneda para mostrar
  const formatCurrency = (value, currency = formData.currency) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency === 'VES' ? 'VES' : 'USD',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Totales
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item xs={12} md={6}>
          {/* Espacio para notas o campos adicionales si se requieren */}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            p: 2, 
            border: '1px solid rgba(0, 0, 0, 0.12)', 
            borderRadius: 1 
          }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Subtotal:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography>
                  {formatCurrency(formData.subtotal)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2">IVA (16%):</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography>
                  {formatCurrency(formData.taxAmount)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total:
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatCurrency(formData.total)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalsSection;