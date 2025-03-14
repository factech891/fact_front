// src/pages/dashboard/components/ExchangeRateSelector/index.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  TextField, 
  CircularProgress, 
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import SyncIcon from '@mui/icons-material/Sync';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import exchangeRateApi from '../../../../services/exchangeRateApi';

const ExchangeRateSelector = ({ onRateChange, totalVES }) => {
  // Estado para la tasa de cambio
  const [rate, setRate] = useState(66);
  const [editRate, setEditRate] = useState(66);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Usar useRef para evitar efectos secundarios no deseados
  const initialRender = useRef(true);
  const previousRate = useRef(rate);

  // Efecto para cargar tasa guardada al iniciar
  useEffect(() => {
    fetchRate();
  }, []);

  // Efecto para notificar cambios en la tasa - CORREGIDO con useRef
  useEffect(() => {
    // Saltar la primera renderización
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    // Solo notificar cambios si la tasa realmente cambió
    if (rate !== previousRate.current && onRateChange) {
      previousRate.current = rate;
      onRateChange(rate);
    }
  }, [rate, onRateChange]);

  // Función para obtener tasa
  const fetchRate = async () => {
    setLoading(true);
    try {
      const { rate: newRate, mode } = await exchangeRateApi.getCurrentRate();
      setRate(newRate);
      setEditRate(newRate);
      previousRate.current = newRate; // Actualizar la referencia
      setIsAutoMode(mode === 'auto');
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario de edición
  const handleRateChange = (e) => {
    setEditRate(parseFloat(e.target.value) || 0);
  };

  // Guardar cambios manuales
  const saveManualRate = async () => {
    try {
      await exchangeRateApi.setManualRate(editRate);
      setRate(editRate);
      previousRate.current = editRate; // Actualizar la referencia
      setIsAutoMode(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar tasa manual:', error);
    }
  };

  // Cambiar entre modo automático y manual
  const handleModeChange = async (event) => {
    const autoMode = event.target.checked;
    
    try {
      setLoading(true);
      if (autoMode) {
        // Cambiar a modo automático
        const result = await exchangeRateApi.switchToAutoMode();
        setRate(result.rate);
        setEditRate(result.rate);
        previousRate.current = result.rate; // Actualizar la referencia
      } else {
        // Cambiar a modo manual con la tasa actual
        await exchangeRateApi.setManualRate(rate);
      }
      
      setIsAutoMode(autoMode);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al cambiar modo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRate(rate);
  };

  // Formatear moneda
  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1 
      }}>
        <Typography variant="caption" color="#AAA">
          Tasa de cambio
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress size={16} sx={{ color: '#AAA', mr: 1 }} />
          ) : (
            <Tooltip title="Actualizar tasa">
              <IconButton 
                size="small" 
                sx={{ color: '#AAA', mr: 0.5 }}
                onClick={fetchRate}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 1
      }}>
        <Typography variant="body2" color="white">
          ≈ {formatCurrency(totalVES / rate)}
        </Typography>
        
        <Tooltip title="Tasa de cambio actual">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ fontSize: 16, color: '#AAA', mr: 0.5 }} />
            <Typography variant="caption" color="#AAA">
              {rate.toFixed(2)} VES/USD
            </Typography>
            {isAutoMode && (
              <Tooltip title="Sincronizado automáticamente">
                <SyncIcon 
                  sx={{ 
                    ml: 0.5, 
                    fontSize: 12, 
                    color: '#4caf50',
                    animation: 'spin 4s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Tooltip>
      </Box>
      
      {isEditing ? (
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Tasa"
            type="number"
            value={editRate}
            onChange={handleRateChange}
            variant="outlined"
            size="small"
            fullWidth
            InputLabelProps={{ sx: { color: '#AAA', fontSize: '0.8rem' } }}
            InputProps={{ 
              sx: { color: 'white' },
              endAdornment: (
                <Typography variant="caption" color="#AAA" sx={{ ml: 1, fontSize: '0.7rem' }}>
                  VES/USD
                </Typography>
              )
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#4477CE' }
              }
            }}
          />
          <IconButton 
            size="small" 
            sx={{ color: '#4CAF50', ml: 1 }}
            onClick={saveManualRate}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: '#F44336' }}
            onClick={handleCancelEdit}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch 
                checked={isAutoMode}
                onChange={handleModeChange}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#4477CE',
                    '&:hover': { backgroundColor: 'rgba(68, 119, 206, 0.08)' }
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4477CE'
                  }
                }}
              />
            }
            label={
              <Typography variant="caption" color="#AAA" sx={{ fontSize: '0.7rem' }}>
                {isAutoMode ? "Automático (BCV)" : "Manual"}
              </Typography>
            }
            sx={{ ml: -1 }}
          />
          
          {!isAutoMode && (
            <Tooltip title="Editar tasa">
              <IconButton 
                size="small" 
                sx={{ color: '#AAA' }}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ExchangeRateSelector;