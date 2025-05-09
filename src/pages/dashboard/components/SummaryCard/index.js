import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const SummaryCard = ({ 
  title,
  value, 
  growth, 
  icon, 
  currency,
  avatarColor = '#4285F4'
}) => {
  // Determinar si el crecimiento es positivo o negativo
  const isPositive = growth >= 0;
  
  // Función para formatear valores monetarios
  const formatValue = () => {
    if (currency) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
    }
    return value;
  };
  
  // Seleccionar el icono basado en el parámetro icon
  const renderIcon = () => {
    switch (icon) {
      case 'money':
        return <AttachMoneyIcon sx={{ fontSize: 18 }} />;
      case 'people':
        return <PeopleIcon sx={{ fontSize: 18 }} />;
      case 'receipt':
        return <ReceiptIcon sx={{ fontSize: 18 }} />;
      case 'product':
        return <ShoppingBasketIcon sx={{ fontSize: 18 }} />;
      default:
        return <AttachMoneyIcon sx={{ fontSize: 18 }} />;
    }
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
      <CardContent sx={{ py: 1, px: 1.5, position: 'relative' }}>
        <Box sx={{ 
          position: 'absolute',
          top: '-10px',
          right: '10px',
          zIndex: 1
        }}>
          <Avatar 
            sx={{ 
              bgcolor: avatarColor,
              width: 32,
              height: 32,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            {renderIcon()}
          </Avatar>
        </Box>
        
        <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
          {title}
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '1.8rem',
            lineHeight: 1.1,
            my: 0.5
          }}
        >
          {formatValue()}
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
      </CardContent>
    </Card>
  );
};

export default SummaryCard;