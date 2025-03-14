// src/pages/dashboard/components/ExchangeRateSelector/index.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const ExchangeRateSelector = ({ onRateChange, totalVES, initialRate }) => {
  // Estado para la tasa de cambio - Inicialización con prop
  const [rate, setRate] = useState(initialRate || 66);
  const [editRate, setEditRate] = useState(initialRate || 66);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Referencias para controlar actualizaciones
  const initialRender = useRef(true);
  const previousRate = useRef(rate);

  // Efecto para sincronizar cuando cambia initialRate desde fuera
  useEffect(() => {
    if (initialRate && Math.abs(initialRate - rate) > 0.01) {
      setRate(initialRate);
      setEditRate(initialRate);
      previousRate.current = initialRate;
    }
  }, [initialRate]); // Quitamos 'rate' de las dependencias

  // Efecto para escuchar cambios globales en la tasa
  useEffect(() => {
    // Handler para eventos de cambio de tasa
    const handleGlobalRateChange = (newRate, newMode) => {
      console.log("Evento de cambio de tasa recibido en Selector:", newRate, newMode);
      
      // Solo actualizar si el valor es suficientemente diferente
      if (Math.abs(newRate - rate) > 0.01) {
        setRate(newRate);
        setEditRate(newRate);
        previousRate.current = newRate;
      }
      
      setIsAutoMode(newMode === 'auto');
    };
    
    // Registrar listener
    exchangeRateApi.subscribeToRateChanges(handleGlobalRateChange);
    
    // Limpiar al desmontar
    return () => {
      exchangeRateApi.unsubscribeFromRateChanges(handleGlobalRateChange);
    };
  }, []); // Sin dependencias para evitar recrear el efecto

  // Efecto para cargar tasa guardada al iniciar
  useEffect(() => {
    fetchRate();
  }, []);

  // Efecto para notificar cambios en la tasa
  useEffect(() => {
    // Saltar la primera renderización
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    // Solo notificar cambios si la tasa realmente cambió significativamente
    if (Math.abs(rate - previousRate.current) > 0.01 && onRateChange) {
      previousRate.current = rate;
      onRateChange(rate);
    }
  }, [rate, onRateChange]);

  // Función para obtener tasa
  const fetchRate = async () => {
    setLoading(true);
    try {
      const { rate: newRate, mode } = await exchangeRateApi.getCurrentRate();
      
      // Solo actualizar si realmente hay un cambio significativo
      if (Math.abs(newRate - rate) > 0.01) {
        setRate(newRate);
        setEditRate(newRate);
        previousRate.current = newRate;
        setIsAutoMode(mode === 'auto');
        
        // Evitar bucles infinitos
        if (onRateChange && Math.abs(newRate - rate) > 0.01) {
          onRateChange(newRate);
        }
      }
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
      // Solo actualizar si hay un cambio real
      if (Math.abs(editRate - rate) > 0.01) {
        await exchangeRateApi.setManualRate(editRate);
        setRate(editRate);
        previousRate.current = editRate;
        setIsAutoMode(false);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar tasa manual:', error);
    }
  };

  // Cambiar entre modo automático y manual
  const handleModeChange = useCallback(async (event) => {
    const autoMode = event.target.checked;
    
    try {
      setLoading(true);
      if (autoMode) {
        // Cambiar a modo automático
        const result = await exchangeRateApi.switchToAutoMode();
        
        // Verificar que realmente hay un cambio
        if (Math.abs(result.rate - rate) > 0.01) {
          setRate(result.rate);
          setEditRate(result.rate);
          previousRate.current = result.rate;
        }
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
  }, [rate]);

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
    <Box sx={{ mt: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 0.5 
      }}>
        <Typography variant="caption" color="#AAA" sx={{ fontSize: '0.7rem' }}>
          Tasa de cambio
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress size={14} sx={{ color: '#AAA', mr: 1 }} />
          ) : (
            <Tooltip title="Actualizar tasa">
              <IconButton 
                size="small" 
                sx={{ color: '#AAA', mr: 0.5, p: 0.5 }}
                onClick={fetchRate}
              >
                <RefreshIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 0.5
      }}>
        <Typography variant="body2" color="white" sx={{ fontSize: '0.75rem' }}>
          ≈ {formatCurrency(totalVES / rate)}
        </Typography>
        
        <Tooltip title="Tasa de cambio actual">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ fontSize: 14, color: '#AAA', mr: 0.5 }} />
            <Typography variant="caption" color="#AAA" sx={{ fontSize: '0.7rem' }}>
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
        <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Tasa"
            type="number"
            value={editRate}
            onChange={handleRateChange}
            variant="outlined"
            size="small"
            fullWidth
            InputLabelProps={{ sx: { color: '#AAA', fontSize: '0.75rem' } }}
            InputProps={{ 
              sx: { color: 'white', height: '30px', fontSize: '0.8rem' },
              endAdornment: (
                <Typography variant="caption" color="#AAA" sx={{ ml: 1, fontSize: '0.65rem' }}>
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
            sx={{ color: '#4CAF50', ml: 1, p: 0.5 }}
            onClick={saveManualRate}
          >
            <CheckIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: '#F44336', p: 0.5 }}
            onClick={handleCancelEdit}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
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
                  '& .MuiSwitch-switchBase': {
                    padding: '1px',
                  },
                  '& .MuiSwitch-thumb': {
                    width: 12,
                    height: 12,
                  },
                  '& .MuiSwitch-track': {
                    height: 16,
                  },
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
              <Typography variant="caption" color="#AAA" sx={{ fontSize: '0.65rem' }}>
                {isAutoMode ? "Automático" : "Manual"}
              </Typography>
            }
            sx={{ ml: -1, mt: 0 }}
          />
          
          {!isAutoMode && (
            <Tooltip title="Editar tasa">
              <IconButton 
                size="small" 
                sx={{ color: '#AAA', p: 0.5 }}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ExchangeRateSelector;