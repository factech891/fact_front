// src/pages/invoices/InvoiceForm/ClientSection.js
import React from 'react';
import {
  Box, Typography, Grid, Divider,
  FormControl, Select, MenuItem, InputLabel, TextField
} from '@mui/material';
import { CURRENCY_LIST } from '../constants/taxRates';

const ClientSection = ({ 
  client, 
  moneda, 
  condicionesPago, 
  diasCredito, 
  clients, 
  errors, 
  onClientChange, 
  onMonedaChange, 
  onCondicionesChange, 
  onDiasCreditoChange 
}) => {
  
  // Función para manejar el cambio de cliente
  const handleClientChange = (e) => {
    const selectedClient = clients.find(c => c._id === e.target.value);
    onClientChange(selectedClient);
  };

  return (
    <>
      {/* Cliente */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="white" gutterBottom>
          Cliente
        </Typography>
        <FormControl fullWidth>
          <Select
            value={client?._id || ''}
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
            value={moneda || 'VES'}
            onChange={(e) => onMonedaChange(e.target.value)}
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
            value={condicionesPago || 'Contado'}
            onChange={(e) => onCondicionesChange(e.target.value)}
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

      {/* Días de crédito si aplica */}
      {condicionesPago === 'Crédito' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="white" sx={{ mb: 1 }}>
            Días de Crédito
          </Typography>
          <TextField
            type="number"
            value={diasCredito || 30}
            onChange={(e) => onDiasCreditoChange(parseInt(e.target.value) || 30)}
            variant="outlined"
            fullWidth
            InputProps={{
              sx: { 
                bgcolor: '#222',
                color: 'white',
                height: '40px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
              }
            }}
            error={!!errors?.diasCredito}
            helperText={errors?.diasCredito}
          />
        </Box>
      )}
      
      {/* Información del cliente seleccionado */}
      {client && (
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
                <strong style={{ color: 'white' }}>Nombre:</strong> {client.nombre}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                <strong style={{ color: 'white' }}>Dirección:</strong> {client.direccion || 'No disponible'}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                <strong style={{ color: 'white' }}>Teléfono:</strong> {client.telefono || 'No disponible'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ClientSection;