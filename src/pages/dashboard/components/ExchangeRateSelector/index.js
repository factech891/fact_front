import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  CircularProgress, 
  Tooltip 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { getExchangeRates } from '../../../../services/exchangeRateApi';

const ExchangeRateSelector = ({ onRateChange, totalVES }) => {
  // Estado para las tasas de cambio
  const [rates, setRates] = useState({
    bcv: 35.27,
    usdt: 36.10,
    average: 35.68
  });
  const [selectedRate, setSelectedRate] = useState('average');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRates, setEditRates] = useState({ ...rates });

  // Efecto para cargar tasas guardadas al iniciar
  useEffect(() => {
    // Cargar tasas desde localStorage
    const savedBcv = localStorage.getItem('tasaCambioBCV');
    const savedUsdt = localStorage.getItem('tasaCambioUSDT');
    const savedAverage = localStorage.getItem('tasaCambioPromedio');
    
    const loadedRates = {
      bcv: savedBcv ? parseFloat(savedBcv) : rates.bcv,
      usdt: savedUsdt ? parseFloat(savedUsdt) : rates.usdt,
      average: savedAverage ? parseFloat(savedAverage) : rates.average
    };
    
    setRates(loadedRates);
    setEditRates(loadedRates);
    
    // Intentar obtener tasas actualizadas
    fetchRates();
  }, []);

  // Efecto para notificar cambios en la tasa seleccionada
  useEffect(() => {
    if (onRateChange) {
      onRateChange(getSelectedRate());
    }
  }, [selectedRate, rates, onRateChange]);

  // Función para obtener tasas desde la API
  const fetchRates = async () => {
    setLoading(true);
    try {
      const newRates = await getExchangeRates();
      setRates(newRates);
      setEditRates(newRates);
      
      // Guardar en localStorage
      localStorage.setItem('tasaCambioBCV', newRates.bcv);
      localStorage.setItem('tasaCambioUSDT', newRates.usdt);
      localStorage.setItem('tasaCambioPromedio', newRates.average);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener la tasa seleccionada actualmente
  const getSelectedRate = () => {
    return rates[selectedRate];
  };

  // Manejar el cambio de selección de tasa
  const handleRateSelect = (rateKey) => {
    setSelectedRate(rateKey);
  };

  // Manejar cambios en el formulario de edición
  const handleRateChange = (key, value) => {
    setEditRates({
      ...editRates,
      [key]: parseFloat(value) || 0
    });
  };

  // Guardar cambios manuales
  const saveManualRates = () => {
    setRates(editRates);
    
    // Guardar en localStorage
    localStorage.setItem('tasaCambioBCV', editRates.bcv);
    localStorage.setItem('tasaCambioUSDT', editRates.usdt);
    localStorage.setItem('tasaCambioPromedio', editRates.average);
    
    setDialogOpen(false);
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
    <Box sx={{ mt: 2 }}>
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
            <Tooltip title="Actualizar tasas">
              <IconButton 
                size="small" 
                sx={{ color: '#AAA', mr: 0.5 }}
                onClick={fetchRates}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Editar tasas">
            <IconButton 
              size="small" 
              sx={{ color: '#AAA' }}
              onClick={() => setDialogOpen(true)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 1.5
      }}>
        <Typography variant="body2" color="white">
          ≈ {formatCurrency(totalVES / getSelectedRate())}
        </Typography>
        
        <Tooltip title="Tasa de cambio actual">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ fontSize: 16, color: '#AAA', mr: 0.5 }} />
            <Typography variant="caption" color="#AAA">
              {getSelectedRate().toFixed(2)} VES/USD
            </Typography>
          </Box>
        </Tooltip>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <Chip 
          size="small"
          label={`BCV: ${rates.bcv.toFixed(2)}`}
          onClick={() => handleRateSelect('bcv')}
          sx={{ 
            bgcolor: selectedRate === 'bcv' ? '#4477CE' : '#2A2A2A',
            color: 'white',
            '&:hover': { bgcolor: selectedRate === 'bcv' ? '#3366bb' : '#333' }
          }}
        />
        <Chip 
          size="small"
          label={`USDT: ${rates.usdt.toFixed(2)}`}
          onClick={() => handleRateSelect('usdt')}
          sx={{ 
            bgcolor: selectedRate === 'usdt' ? '#4477CE' : '#2A2A2A',
            color: 'white',
            '&:hover': { bgcolor: selectedRate === 'usdt' ? '#3366bb' : '#333' }
          }}
        />
        <Chip 
          size="small"
          label={`Promedio: ${rates.average.toFixed(2)}`}
          onClick={() => handleRateSelect('average')}
          sx={{ 
            bgcolor: selectedRate === 'average' ? '#4477CE' : '#2A2A2A',
            color: 'white',
            '&:hover': { bgcolor: selectedRate === 'average' ? '#3366bb' : '#333' }
          }}
        />
      </Box>
      
      {/* Diálogo para editar tasas manualmente */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2A2A2A',
            color: 'white',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>Editar Tasas de Cambio</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Tasa BCV"
              type="number"
              value={editRates.bcv}
              onChange={(e) => handleRateChange('bcv', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ sx: { color: '#AAA' } }}
              InputProps={{ sx: { color: 'white' } }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#4477CE' }
                }
              }}
            />
            <TextField
              label="Tasa USDT"
              type="number"
              value={editRates.usdt}
              onChange={(e) => handleRateChange('usdt', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ sx: { color: '#AAA' } }}
              InputProps={{ sx: { color: 'white' } }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#4477CE' }
                }
              }}
            />
            <TextField
              label="Tasa Promedio"
              type="number"
              value={editRates.average}
              onChange={(e) => handleRateChange('average', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ sx: { color: '#AAA' } }}
              InputProps={{ sx: { color: 'white' } }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#4477CE' }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            sx={{ color: '#AAA' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={saveManualRates}
            variant="contained"
            sx={{ 
              bgcolor: '#4477CE',
              '&:hover': { bgcolor: '#3366BB' }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExchangeRateSelector;