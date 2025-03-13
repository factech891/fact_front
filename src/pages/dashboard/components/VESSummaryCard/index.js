import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar 
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import ExchangeRateSelector from '../ExchangeRateSelector';

const VESSummaryCard = ({ title, value, growth, selectedRate, onRateChange }) => {
  // Determinar si el crecimiento es positivo o negativo
  const isPositive = growth >= 0;
  
  // Función para formatear valores monetarios
  const formatCurrency = (value, currency = 'VES') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

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
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ 
          position: 'absolute',
          top: '-15px',
          right: '15px',
          zIndex: 1
        }}>
          <Avatar 
            sx={{ 
              bgcolor: '#4477CE', // Azul para VES
              width: 50,
              height: 50,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            <PaidIcon />
          </Avatar>
        </Box>
        
        <Typography variant="h6" color="#CCC" sx={{ mb: 1 }}>
          💰 {title || 'Ingresos VES'}
        </Typography>
        
        {/* Total VES */}
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '2.5rem',
            mb: 1
          }}
        >
          {formatCurrency(value, 'VES')}
        </Typography>
        
        {/* Componente de selección de tasas */}
        <ExchangeRateSelector 
          onRateChange={onRateChange}
          totalVES={value}
        />
      </CardContent>
    </Card>
  );
};

export default VESSummaryCard;