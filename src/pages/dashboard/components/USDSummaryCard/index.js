import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const USDSummaryCard = ({ 
  title = "💵 Ingresos USD",
  value, 
  growth, 
  exchangeRate = 10
}) => {
  // Determinar si el crecimiento es positivo o negativo
  const isPositive = growth >= 0;
  
  // Función para formatear valores monetarios
  const formatCurrency = (value, currency = 'USD') => {
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

  // Calcular el equivalente en VES
  const vesEquivalent = value * exchangeRate;

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
              bgcolor: '#66BB6A', // Verde para USD
              width: 32,
              height: 32,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <AttachMoneyIcon sx={{ fontSize: 18 }} />
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
          {formatCurrency(value, 'USD')}
        </Typography>
        
        {/* Equivalente en VES */}
        <Typography 
          variant="body2" 
          color="#AAA"
          sx={{ fontSize: '0.7rem' }}
        >
          Equivale a: {formatCurrency(vesEquivalent, 'VES')}
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
          alignItems: 'center'
        }}>
          <InfoIcon sx={{ fontSize: 12, color: '#AAA', mr: 0.3 }} />
          <Typography variant="caption" color="#AAA" sx={{ fontSize: '0.65rem' }}>
            Tasa: {exchangeRate.toFixed(2)} VES/USD
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default USDSummaryCard;