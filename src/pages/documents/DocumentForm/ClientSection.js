// src/pages/documents/DocumentForm/ClientSection.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Divider // Aseguramos que Divider esté importado
} from '@mui/material';

// Importaciones de constantes
import { CURRENCY_LIST } from '../../invoices/constants/taxRates';

const ClientSection = ({ formData, clients, errors, onFieldChange }) => {
  // Mejorar la estética para que los campos estén mejor alineados
  const inputStyles = {
    height: '40px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.87)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Información del Cliente
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        {/* Selección de Cliente */}
        <Grid item xs={12}>
          <Autocomplete
            options={clients || []}
            getOptionLabel={(option) => option.nombre || ''}
            value={formData.client || null}
            onChange={(event, newValue) => onFieldChange('client', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                error={!!errors?.client}
                helperText={errors?.client}
                fullWidth
                size="small"
                sx={inputStyles}
              />
            )}
          />
        </Grid>
        
        <Grid container item spacing={3}>
          {/* Moneda */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="currency-label">Moneda</InputLabel>
              <Select
                labelId="currency-label"
                value={formData.currency || 'VES'}
                label="Moneda"
                onChange={(e) => onFieldChange('currency', e.target.value)}
                sx={inputStyles}
              >
                {CURRENCY_LIST.map((currency) => (
                  <MenuItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Condiciones de Pago */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="payment-terms-label">Condiciones de Pago</InputLabel>
              <Select
                labelId="payment-terms-label"
                value={formData.paymentTerms || 'Contado'}
                label="Condiciones de Pago"
                onChange={(e) => {
                  onFieldChange('paymentTerms', e.target.value);
                  // Resetear días de crédito si cambia a contado
                  if (e.target.value !== 'Crédito') {
                    onFieldChange('creditDays', 0);
                  }
                }}
                sx={inputStyles}
              >
                <MenuItem value="Contado">Contado</MenuItem>
                <MenuItem value="Crédito">Crédito</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Días de Crédito - Solo visible si las condiciones de pago son a crédito */}
          {formData.paymentTerms === 'Crédito' && (
            <Grid item xs={12} md={6}>
              <TextField
                label="Días de Crédito"
                type="number"
                value={formData.creditDays || 0}
                onChange={(e) => onFieldChange('creditDays', parseInt(e.target.value) || 0)}
                fullWidth
                size="small"
                error={!!errors?.creditDays}
                helperText={errors?.creditDays}
                InputProps={{ inputProps: { min: 0 } }}
                sx={inputStyles}
              />
            </Grid>
          )}
        </Grid>
        
        {/* Información adicional del cliente - mostrar si hay un cliente seleccionado */}
        {formData.client && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Typography variant="subtitle2" gutterBottom>
                Información del Cliente:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Nombre:</strong> {formData.client.nombre}
                  </Typography>
                  {formData.client.tipoDocumento && formData.client.numeroDocumento && (
                    <Typography variant="body2">
                      <strong>Documento:</strong> {formData.client.tipoDocumento}: {formData.client.numeroDocumento}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Dirección:</strong> {formData.client.direccion || 'No disponible'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Teléfono:</strong> {formData.client.telefono || 'No disponible'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ClientSection;