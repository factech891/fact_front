import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';

const TotalsSection = ({ formData, onChange }) => {
  // Currency options
  const currencies = [
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'USD', label: 'Dólar ($)', symbol: '$' },
    { value: 'GBP', label: 'Libra Esterlina (£)', symbol: '£' }
  ];

  // Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.value === currencyCode);
    return currency ? currency.symbol : '€';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: formData.currency || 'EUR'
    }).format(amount || 0);
  };

  // Handle currency change
  const handleCurrencyChange = (event) => {
    onChange('currency', event.target.value);
  };

  // Handle terms and notes changes
  const handleTextChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Totales y Detalles Adicionales
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Currency Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="currency-label">Moneda</InputLabel>
            <Select
              labelId="currency-label"
              value={formData.currency || 'EUR'}
              label="Moneda"
              onChange={handleCurrencyChange}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.value} value={currency.value}>
                  {currency.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Spacer for alignment */}
        <Grid item xs={12} md={6}></Grid>

        {/* Amounts Summary */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              {/* Subtotal */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 1 
              }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">
                  {formatCurrency(formData.subtotal)}
                </Typography>
              </Box>

              {/* Tax Amount */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography variant="body2">Impuestos:</Typography>
                <Typography variant="body2">
                  {formatCurrency(formData.taxAmount)}
                </Typography>
              </Box>

              {/* Divider before total */}
              <Divider sx={{ my: 1 }} />

              {/* Total */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontWeight: 'bold'
              }}>
                <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatCurrency(formData.total)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notes and Terms */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Información Adicional
          </Typography>
          
          {/* Notes */}
          <TextField
            label="Notas"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => handleTextChange('notes', e.target.value)}
            placeholder="Notas para el cliente o información adicional"
            size="small"
            sx={{ mb: 2 }}
          />
          
          {/* Terms */}
          <TextField
            label="Términos y Condiciones"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={formData.terms || ''}
            onChange={(e) => handleTextChange('terms', e.target.value)}
            placeholder="Términos y condiciones del documento"
            size="small"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalsSection;