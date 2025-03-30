// src/pages/documents/DocumentForm/ClientSection.js
import React from 'react';
import {
  Box, Typography, Grid, Divider, // Aseguramos que Divider esté importado
  FormControl, Select, MenuItem, InputLabel
} from '@mui/material';
import { CURRENCY_LIST } from '../../invoices/constants/taxRates';

const ClientSection = ({ formData, clients, errors, onFieldChange }) => {
  // Función para manejar el cambio de cliente
  const handleClientChange = (e) => {
    const selectedClient = clients.find(c => c._id === e.target.value);
    onFieldChange('client', selectedClient);
  };

  return (
    <>
      {/* Cliente */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <Select
            value={formData.client?._id || ''}
            onChange={handleClientChange}
            displayEmpty
            variant="outlined"
            sx={{ 
              bgcolor: '#222',
              color: 'white',
              height: '40px',
              mb: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
            }}
            error={!!errors?.client}
          >
            <MenuItem value="" disabled>Seleccione un cliente</MenuItem>
            {clients.map((client) => (
              <MenuItem key={client._id} value={client._id}>
                {client.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Moneda y Condiciones de Pago */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <Typography variant="body2" color="white" sx={{ mb: 1 }}>
            Moneda
          </Typography>
          <Select
            value={formData.currency || 'VES'}
            onChange={(e) => onFieldChange('currency', e.target.value)}
            sx={{ 
              bgcolor: '#222',
              color: 'white',
              height: '40px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
            }}
          >
            {CURRENCY_LIST.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Typography variant="body2" color="white" sx={{ mb: 1 }}>
            Condiciones de Pago
          </Typography>
          <Select
            value={formData.paymentTerms || 'Contado'}
            onChange={(e) => {
              onFieldChange('paymentTerms', e.target.value);
              if (e.target.value !== 'Crédito') {
                onFieldChange('creditDays', 0);
              }
            }}
            sx={{ 
              bgcolor: '#222',
              color: 'white',
              height: '40px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
            }}
          >
            <MenuItem value="Contado">Contado</MenuItem>
            <MenuItem value="Crédito">Crédito</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Información del cliente seleccionado */}
      {formData.client && (
        <Box sx={{ 
          p: 2, 
          bgcolor: '#222', 
          borderRadius: 1,
          mt: 2 
        }}>
          <Typography variant="body1" color="white" gutterBottom>
            Información del Cliente:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                <strong style={{ color: 'white' }}>Nombre:</strong> {formData.client.nombre}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                <strong style={{ color: 'white' }}>Dirección:</strong> {formData.client.direccion || 'No disponible'}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                <strong style={{ color: 'white' }}>Teléfono:</strong> {formData.client.telefono || 'No disponible'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ClientSection;