import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const VESSummaryCard = ({ 
  title = "💰 Ingresos VES", 
  value, 
  growth, 
  onRateChange, 
  currentRate = 35.68 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rateValue, setRateValue] = useState(currentRate.toString());
  
  // Determinar si el crecimiento es positivo o negativo
  const isPositive = growth >= 0;

  // Función para formatear valores monetarios
  const formatCurrency = (value, currency = 'VES') => {
    // Verificar si el valor es un número válido
    const isValidNumber = value !== undefined && value !== null && !isNaN(value);
    
    if (!isValidNumber) {
      return currency === 'USD' ? '$0.00' : 'Bs. 0,00';
    }
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Manejar cambio de tasa
  const handleRateChange = (event) => {
    setRateValue(event.target.value);
  };
  
  // Guardar cambio de tasa
  const handleSaveRate = () => {
    const newRate = parseFloat(rateValue);
    if (!isNaN(newRate) && newRate > 0) {
      onRateChange(newRate);
    } else {
      setRateValue(currentRate.toString());
    }
    setIsEditing(false);
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setRateValue(currentRate.toString());
    setIsEditing(false);
  };
  
  // Calcular el equivalente en USD
  const usdEquivalent = value / currentRate;
  
  return (
    <Card 
      sx={{ 
        bgcolor: '#1E1E1E', 
        borderRadius: 2,
        border: '1px solid #333',
        height: '100%',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ py: 1, px: 1.5, position: 'relative' }}>
        <Box sx={{ 
          position: 'absolute',
          top: '-10px',
          right: '10px',
          zIndex: 1
        }}>
          <Avatar 
            sx={{ 
              bgcolor: '#4477CE',
              width: 32,
              height: 32,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 18 }} />
          </Avatar>
        </Box>
        
        <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
          {title}
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '1.5rem',
            lineHeight: 1.1,
            my: 0.3
          }}
        >
          {formatCurrency(value, 'VES')}
        </Typography>
        
        {/* Equivalente en USD */}
        <Typography 
          variant="body2" 
          color="#AAA"
          sx={{ fontSize: '0.7rem' }}
        >
          Equivale a: {formatCurrency(usdEquivalent, 'USD')}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: isPositive ? '#4cd964' : '#ff3b30',
          mt: 0.5,
          fontSize: '0.7rem'
        }}>
          {isPositive ? 
            <TrendingUpIcon sx={{ fontSize: 14 }} /> : 
            <TrendingDownIcon sx={{ fontSize: 14 }} />
          }
          <Typography variant="caption" sx={{ ml: 0.3 }}>
            {isPositive ? '+' : ''}{Math.abs(growth).toFixed(1)}% este mes
          </Typography>
        </Box>
        
        <Box sx={{ 
          mt: 0.5, 
          pt: 0.5,
          borderTop: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {isEditing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <TextField
                value={rateValue}
                onChange={handleRateChange}
                size="small"
                variant="standard"
                InputProps={{
                  endAdornment: <InputAdornment position="end" sx={{fontSize: '0.65rem'}}>VES/USD</InputAdornment>,
                  sx: { 
                    fontSize: '0.7rem', 
                    color: 'white',
                    '.MuiInputBase-input': { 
                      py: 0 
                    } 
                  }
                }}
                sx={{ 
                  flexGrow: 1,
                  '.MuiInputBase-root': { 
                    color: 'white' 
                  },
                  '.MuiInput-underline:before': { 
                    borderBottomColor: '#444' 
                  },
                  '.MuiInput-underline:hover:not(.Mui-disabled):before': { 
                    borderBottomColor: '#666' 
                  }
                }}
              />
              <IconButton 
                size="small" 
                onClick={handleSaveRate}
                color="primary"
                sx={{ p: 0.2 }}
              >
                <CheckIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleCancelEdit}
                color="error"
                sx={{ p: 0.2 }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ fontSize: 12, color: '#AAA', mr: 0.3 }} />
                <Typography variant="caption" color="#AAA" sx={{ fontSize: '0.65rem' }}>
                  Tasa: {currentRate.toFixed(2)} VES/USD
                </Typography>
              </Box>
              <Tooltip title="Editar tasa de cambio">
                <IconButton 
                  size="small" 
                  onClick={() => setIsEditing(true)}
                  sx={{ color: '#AAA', p: 0.2 }}
                >
                  <EditIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default VESSummaryCard;