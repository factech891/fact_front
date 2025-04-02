// src/pages/documents/UnifiedDocumentForm/TotalsSection.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { formatCurrency } from './utils/calculations';

/**
 * Sección para mostrar los totales
 */
const TotalsSection = ({ formData }) => {
  // Cálculo de totales
  const subtotal = formData.subtotal;
  const taxAmount = formData.tax || formData.taxAmount || 0;
  const total = formData.total;
  
  // Cálculo de montos exentos
  const taxableSubtotal = formData.items.reduce((sum, item) => {
    if (item.taxExempt) return sum;
    return sum + (item.quantity * item.price);
  }, 0);
  
  const exemptSubtotal = subtotal - taxableSubtotal;
  const exemptItemsCount = formData.items.filter(item => item.taxExempt).length;
  
  return (
    <Box>
      <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CalculateIcon sx={{ mr: 1 }} />
        Resumen y Totales
      </Typography>
      <Divider sx={{ mb: 3, opacity: 0.2 }} />
      
      <Grid container spacing={3}>
        {/* Resumen */}
        <Grid item xs={12} md={7}>
          <Card 
            elevation={4}
            sx={{ 
              bgcolor: 'rgba(45, 45, 45, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Resumen del Documento
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ítems totales
                    </Typography>
                    <Typography variant="h6">
                      {formData.items.length} producto{formData.items.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Cantidad total
                    </Typography>
                    <Typography variant="h6">
                      {formData.items.reduce((sum, item) => sum + item.quantity, 0)} unidades
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ítems exentos de IVA
                    </Typography>
                    <Typography variant="h6">
                      {exemptItemsCount} producto{exemptItemsCount !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Moneda
                    </Typography>
                    <Typography variant="h6">
                      {formData.currency === 'VES' ? 'Bolívares (VES)' : 
                       formData.currency === 'USD' ? 'Dólares (USD)' : 
                       'Euros (EUR)'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Totales */}
        <Grid item xs={12} md={5}>
          <Card 
            elevation={4}
            sx={{ 
              bgcolor: 'rgba(25, 118, 210, 0.1)',
              border: '1px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '8px'
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Totales
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatCurrency(subtotal, formData.currency)}
                  </Typography>
                </Grid>
                
                {exemptSubtotal > 0 && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Base imponible:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        {formatCurrency(taxableSubtotal, formData.currency)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Exento:
                        <Tooltip title="Monto exento de IVA">
                          <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                            <InfoIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        {formatCurrency(exemptSubtotal, formData.currency)}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    IVA (16%):
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatCurrency(taxAmount, formData.currency)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold">TOTAL:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    align="right"
                    sx={{ color: 'primary.main', fontSize: '1.25rem' }}
                  >
                    {formatCurrency(total, formData.currency)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalsSection;