// src/pages/documents/UnifiedDocumentForm/ClientSection.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  Paper,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as AddressIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon
} from '@mui/icons-material';

/**
 * Sección para seleccionar cliente y configurar moneda/condiciones de pago
 */
const ClientSection = ({ formData, clients, errors, onFieldChange }) => {
  // Estado para controlar la expansión de los detalles del cliente
  const [expanded, setExpanded] = useState(false);
  
  // Manejar selección de cliente
  const handleClientChange = (event, newValue) => {
    onFieldChange('client', newValue);
  };
  
  // Manejar cambio de moneda
  const handleCurrencyChange = (event) => {
    onFieldChange('currency', event.target.value);
  };
  
  // Manejar cambio en condiciones de pago
  const handlePaymentTermsChange = (event) => {
    onFieldChange('paymentTerms', event.target.value);
  };
  
  // Manejar cambio en días de crédito
  const handleCreditDaysChange = (event) => {
    onFieldChange('creditDays', event.target.value);
  };
  
  // Opciones de moneda
  const currencyOptions = [
    { value: 'VES', label: 'Bolívares (VES)' },
    { value: 'USD', label: 'Dólares (USD)' }
    
  ];
  
  // Opciones de condiciones de pago
  const paymentTermsOptions = [
    { value: 'Contado', label: 'Contado' },
    { value: 'Crédito', label: 'Crédito' }
  ];
  
  return (
    <Box>
      <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <BusinessIcon sx={{ mr: 1 }} />
        Datos del Cliente
      </Typography>
      <Divider sx={{ mb: 3, opacity: 0.2 }} />
      
      <Grid container spacing={3}>
        {/* Selector de cliente */}
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            options={clients}
            getOptionLabel={(option) => option?.nombre || ''}
            value={formData.client || null}
            onChange={handleClientChange}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                required
                error={!!errors.client}
                helperText={errors.client}
                variant="filled"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  )
                }}
                sx={{
                  '& .MuiFilledInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Typography variant="body1" fontWeight="medium">
                    {option.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.rif || option.documento || 'Sin ID'}
                  </Typography>
                </Box>
              </li>
            )}
          />
        </Grid>
        
        {/* Mostrar información del cliente seleccionado */}
        {formData.client && (
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: 'rgba(25, 118, 210, 0.1)', 
                border: '1px solid rgba(25, 118, 210, 0.2)',
                borderRadius: '8px'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                    Razón Social
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formData.client.nombre}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                    RIF/Documento
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formData.client.rif || formData.client.documento || 'No especificado'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                    Teléfono
                  </Typography>
                  <Typography variant="body1">
                    {formData.client.telefono || 'No especificado'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {formData.client.email || 'No especificado'}
                  </Typography>
                </Grid>
                
                {/* Control para expandir/colapsar más información */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => setExpanded(!expanded)}
                      sx={{ color: 'primary.main' }}
                    >
                      {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  
                  <Collapse in={expanded}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AddressIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                        Dirección
                      </Typography>
                      <Typography variant="body2">
                        {formData.client.direccion || 'No especificada'}
                      </Typography>
                    </Box>
                  </Collapse>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
        
        {/* Moneda */}
        <Grid item xs={12} md={4}>
          <FormControl 
            fullWidth
            variant="filled"
            sx={{
              '& .MuiFilledInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }}
          >
            <InputLabel id="currency-label">Moneda</InputLabel>
            <Select
              labelId="currency-label"
              value={formData.currency}
              onChange={handleCurrencyChange}
              label="Moneda"
            >
              {currencyOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Condiciones de pago */}
        <Grid item xs={12} md={4}>
          <FormControl 
            fullWidth
            variant="filled"
            sx={{
              '& .MuiFilledInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }}
          >
            <InputLabel id="payment-terms-label">Condiciones de Pago</InputLabel>
            <Select
              labelId="payment-terms-label"
              value={formData.paymentTerms}
              onChange={handlePaymentTermsChange}
              label="Condiciones de Pago"
            >
              {paymentTermsOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Días de crédito (solo si es a crédito) */}
        {formData.paymentTerms === 'Crédito' && (
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Días de Crédito"
              type="number"
              required
              value={formData.creditDays || ''}
              onChange={handleCreditDaysChange}
              error={!!errors.creditDays}
              helperText={errors.creditDays}
              variant="filled"
              inputProps={{ min: 1 }}
              sx={{
                '& .MuiFilledInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ClientSection;