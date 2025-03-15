// src/pages/dashboard/components/KPICards/index.js
import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Avatar,
  IconButton,
  Tooltip,
  Switch,
  CircularProgress,
  TextField
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SyncIcon from '@mui/icons-material/Sync';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import exchangeRateApi from '../../../../services/exchangeRateApi';

// Mini selector de tasa de cambio compacto
const CompactExchangeRateSelector = ({ onRateChange, initialRate }) => {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [rate, setRate] = useState(initialRate || 67);
  const [editRate, setEditRate] = useState((initialRate || 67).toString());
  const [loading, setLoading] = useState(false);

  // Función para actualizar tasa
  const fetchRate = async () => {
    setLoading(true);
    try {
      const { rate: newRate, mode } = await exchangeRateApi.getCurrentRate();
      
      if (Math.abs(newRate - rate) > 0.01) {
        setRate(newRate);
        setEditRate(newRate.toString());
        setIsAutoMode(mode === 'auto');
        
        if (onRateChange) {
          onRateChange(newRate);
        }
      }
    } catch (error) {
      console.error('Error al actualizar tasa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar modo auto/manual
  const handleModeChange = async (event) => {
    const autoMode = event.target.checked;
    
    try {
      setLoading(true);
      if (autoMode) {
        // Cambiar a modo automático
        const result = await exchangeRateApi.switchToAutoMode();
        
        if (Math.abs(result.rate - rate) > 0.01) {
          setRate(result.rate);
          setEditRate(result.rate.toString());
          
          if (onRateChange) {
            onRateChange(result.rate);
          }
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
  };

  // Actualizar tasa manual
  const handleRateChange = (e) => {
    setEditRate(e.target.value);
  };

  // Guardar tasa manual
  const saveManualRate = async () => {
    try {
      const numericRate = parseFloat(editRate) || 0;
      if (numericRate > 0 && Math.abs(numericRate - rate) > 0.01) {
        await exchangeRateApi.setManualRate(numericRate);
        setRate(numericRate);
        
        if (onRateChange) {
          onRateChange(numericRate);
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar tasa manual:', error);
    }
  };

  // Modo de edición
  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          type="text"
          value={editRate}
          onChange={handleRateChange}
          variant="outlined"
          size="small"
          sx={{ 
            width: '90px',
            '& .MuiOutlinedInput-root': {
              height: '24px',
              fontSize: '0.75rem',
              '& fieldset': { borderColor: '#444' },
              '&:hover fieldset': { borderColor: '#666' },
              '&.Mui-focused fieldset': { borderColor: '#2196F3' }
            },
            '& .MuiOutlinedInput-input': {
              color: 'white',
              p: '4px 6px'
            }
          }}
        />
        <IconButton size="small" onClick={saveManualRate} sx={{ p: 0.2, ml: 0.5 }}>
          <CheckIcon sx={{ fontSize: '0.8rem', color: '#4CAF50' }} />
        </IconButton>
        <IconButton size="small" onClick={() => setIsEditing(false)} sx={{ p: 0.2 }}>
          <CloseIcon sx={{ fontSize: '0.8rem', color: '#F44336' }} />
        </IconButton>
      </Box>
    );
  }

  // Visualización normal
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" color="#8C8C8C" sx={{ fontSize: '0.7rem', mr: 0.5 }}>
          {rate.toFixed(2)} VES/USD
        </Typography>
        {loading && <CircularProgress size={10} sx={{ color: '#8C8C8C', mr: 0.5 }} />}
        <IconButton onClick={fetchRate} size="small" sx={{ p: 0.2 }}>
          <RefreshIcon sx={{ fontSize: '0.8rem', color: '#8C8C8C' }} />
        </IconButton>
      </Box>
      
      <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
        {isAutoMode && (
          <SyncIcon 
            sx={{ 
              mr: 0.5, 
              fontSize: '0.8rem', 
              color: '#4caf50',
              animation: 'spin 4s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
        )}
        <Switch 
          checked={isAutoMode}
          onChange={handleModeChange}
          size="small"
          sx={{
            width: 28,
            height: 14,
            p: 0,
            mr: 0.5,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: '1px',
              '&.Mui-checked': {
                transform: 'translateX(14px)',
                color: '#2196F3'
              }
            },
            '& .MuiSwitch-thumb': {
              width: 12,
              height: 12
            },
            '& .MuiSwitch-track': {
              borderRadius: 16 / 2
            }
          }}
        />
        {!isAutoMode && (
          <Tooltip title="Editar tasa">
            <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ p: 0.2 }}>
              <EditIcon sx={{ fontSize: '0.8rem', color: '#8C8C8C' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

const KPICards = ({ 
  totalUSD, 
  totalVES, 
  totalFacturas, 
  totalClientes, 
  cambioIngresos, 
  cambioFacturas, 
  cambioClientes, 
  exchangeRate,
  onRateChange
}) => {
  // Función para formatear números
  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES').format(Math.round(value));
  };
  
  // Función para mostrar la tendencia con icono y porcentaje
  const renderTrend = (value) => {
    const isPositive = value >= 0;
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        color: isPositive ? '#4CAF50' : '#F44336'
      }}>
        {isPositive ? 
          <TrendingUpIcon sx={{ fontSize: '0.9rem', mr: 0.2 }} /> : 
          <TrendingDownIcon sx={{ fontSize: '0.9rem', mr: 0.2 }} />
        }
        <Typography 
          variant="caption" 
          sx={{ fontWeight: 500, fontSize: '0.7rem' }}
        >
          {isPositive ? '+' : ''}{Math.abs(value)}%
        </Typography>
      </Box>
    );
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* INGRESOS USD */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: '12px', 
          bgcolor: '#222222',
          height: '90px',
          border: '1px solid #383838',
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)'
          }
        }}>
          <CardContent sx={{ 
            p: 1.5, 
            height: '100%',
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="subtitle2" 
                color="#8C8C8C" 
                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
              >
                INGRESOS USD
              </Typography>
              <Avatar 
                sx={{ 
                  bgcolor: '#4CAF50', 
                  width: 22, 
                  height: 22,
                  boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 14 }} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#4CAF50',
                  fontSize: '1.6rem',
                  lineHeight: 1
                }}
              >
                {formatNumber(totalUSD)}
              </Typography>
              {renderTrend(cambioIngresos)}
            </Box>
            
            <Typography 
              variant="caption" 
              color="#8C8C8C"
              sx={{ 
                fontSize: '0.65rem', 
                position: 'absolute', 
                bottom: 8, 
                left: 12 
              }}
            >
              ≈ {formatNumber(totalUSD * exchangeRate)} VES
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {/* INGRESOS VES */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: '12px', 
          bgcolor: '#222222',
          height: '90px',
          border: '1px solid #383838',
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)'
          }
        }}>
          <CardContent sx={{ 
            p: 1.5, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="subtitle2" 
                color="#8C8C8C" 
                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
              >
                INGRESOS VES
              </Typography>
              <Avatar 
                sx={{ 
                  bgcolor: '#2196F3', 
                  width: 22, 
                  height: 22,
                  boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)'
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 14 }} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#2196F3',
                  fontSize: '1.6rem',
                  lineHeight: 1
                }}
              >
                {formatNumber(totalVES)}
              </Typography>
              {renderTrend(cambioIngresos)}
            </Box>
            
            <Box sx={{ mt: 'auto', position: 'absolute', bottom: 8, right: 12 }}>
              <CompactExchangeRateSelector 
                onRateChange={onRateChange}
                initialRate={exchangeRate}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* FACTURACIONES */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: '12px', 
          bgcolor: '#222222',
          height: '90px',
          border: '1px solid #383838',
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)'
          }
        }}>
          <CardContent sx={{ 
            p: 1.5, 
            height: '100%',
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="subtitle2" 
                color="#8C8C8C" 
                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
              >
                FACTURACIONES
              </Typography>
              <Avatar 
                sx={{ 
                  bgcolor: '#FFA726', 
                  width: 22, 
                  height: 22,
                  boxShadow: '0 2px 4px rgba(255, 167, 38, 0.3)'
                }}
              >
                <ReceiptIcon sx={{ fontSize: 14 }} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#FFA726',
                  fontSize: '1.6rem',
                  lineHeight: 1
                }}
              >
                {totalFacturas}
              </Typography>
              {renderTrend(cambioFacturas)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* CLIENTES ACTIVOS */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: '12px', 
          bgcolor: '#222222',
          height: '90px',
          border: '1px solid #383838',
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)'
          }
        }}>
          <CardContent sx={{ 
            p: 1.5, 
            height: '100%',
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="subtitle2" 
                color="#8C8C8C" 
                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
              >
                CLIENTES ACTIVOS
              </Typography>
              <Avatar 
                sx={{ 
                  bgcolor: '#9C27B0', 
                  width: 22, 
                  height: 22,
                  boxShadow: '0 2px 4px rgba(156, 39, 176, 0.3)'
                }}
              >
                <PeopleIcon sx={{ fontSize: 14 }} />
              </Avatar>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#BA68C8',
                  fontSize: '1.6rem',
                  lineHeight: 1
                }}
              >
                {totalClientes}
              </Typography>
              {renderTrend(cambioClientes)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default KPICards;