// src/pages/documents/DocumentForm/TotalsSection.js
import React from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';

const TotalsSection = ({ formData, onFieldChange }) => {
  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: formData.currency
    }).format(amount);
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen de Totales
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Subtotal: {formatCurrency(formData.subtotal)}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            IVA (16%): {formatCurrency(formData.taxAmount)}
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
            Total: {formatCurrency(formData.total)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Notas Adicionales para Totales"
            value={formData.totalNotes || ''}
            onChange={(e) => onFieldChange('totalNotes', e.target.value)}
            fullWidth
            multiline
            rows={4}
            size="small"
            placeholder="Ej: Impuestos incluidos, validez de la oferta, etc."
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default TotalsSection;