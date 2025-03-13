import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tooltip
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const ConsolidatedTotalCard = ({ totalUSD, totalVES, exchangeRate, growth = 0 }) => {
  // Formatear valores monetarios con manejo seguro de valores indefinidos o NaN
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

  // Asegurar que exchangeRate sea un número válido
  const safeExchangeRate = (!exchangeRate || isNaN(exchangeRate)) ? 0 : exchangeRate;

  // Asegurar que growth sea un número válido
  const safeGrowth = (growth === undefined || growth === null || isNaN(growth)) ? 0 : growth;
  
  // Determinar si el crecimiento es positivo o negativo
  const isPositive = safeGrowth >= 0;

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
      <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: '-12px',
          right: '12px',
          zIndex: 1
        }}>
          <Avatar
            sx={{
              bgcolor: '#AB47BC', // Color púrpura para consolidado
              width: 36,
              height: 36,
              boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            <AccountBalanceWalletIcon fontSize="small" />
          </Avatar>
        </Box>

        <Typography variant="subtitle1" color="#CCC" sx={{ mb: 0.5, fontSize: '0.9rem', mt: 0.5, display: 'flex', alignItems: 'center' }}>
          💼 Total Consolidado
          <Tooltip title="Total combinado de todas las monedas convertido a USD y VES">
            <InfoIcon sx={{ ml: 0.5, color: '#AAA', cursor: 'pointer', fontSize: 14 }} />
          </Tooltip>
        </Typography>

        {/* Indicador de crecimiento */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: isPositive ? '#4cd964' : '#ff3b30',
          mb: 0.5,
          fontSize: '0.85rem'
        }}>
          {isPositive ? 
            <TrendingUpIcon fontSize="small" sx={{ fontSize: 16 }} /> : 
            <TrendingDownIcon fontSize="small" sx={{ fontSize: 16 }} />
          }
          <Typography variant="body2" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
            {isPositive ? '+' : ''}{Math.abs(safeGrowth).toFixed(1)}% este mes
          </Typography>
        </Box>

        {/* Totales */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          mt: 0.5
        }}>
          <Box>
            <Typography 
              variant="body2" 
              color="#AAA"
              sx={{ fontSize: '0.75rem', mb: 0.3 }}
            >
              En USD:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                lineHeight: 1.1
              }}
            >
              {formatCurrency(totalUSD, 'USD')}
            </Typography>
          </Box>

          <Box sx={{ mt: 0.5 }}>
            <Typography 
              variant="body2" 
              color="#AAA"
              sx={{ fontSize: '0.75rem', mb: 0.3 }}
            >
              En VES:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                lineHeight: 1.1
              }}
            >
              {formatCurrency(totalVES, 'VES')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #333' }}>
          <Typography variant="caption" color="#AAA" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
            <InfoIcon sx={{ mr: 0.3, fontSize: 12 }} />
            Tasa: {safeExchangeRate.toFixed(2)} VES/USD
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConsolidatedTotalCard;