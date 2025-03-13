import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton,
  Button,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DateRangeSelector = ({ onChange }) => {
  // Obtener mes actual y mes anterior
  const getCurrentMonth = () => {
    const now = new Date();
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    };
  };
  
  const getPreviousMonth = () => {
    const now = new Date();
    return {
      startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      endDate: new Date(now.getFullYear(), now.getMonth(), 0)
    };
  };
  
  // Estado inicial: mes actual
  const [timeRange, setTimeRange] = useState(getCurrentMonth());
  
  // Actualizar cuando cambie el rango
  useEffect(() => {
    if (onChange) {
      onChange(timeRange);
    }
  }, [timeRange, onChange]);
  
  // Navegar al mes anterior
  const handlePreviousMonth = () => {
    setTimeRange(current => {
      const startDate = new Date(current.startDate);
      startDate.setMonth(startDate.getMonth() - 1);
      
      const endDate = new Date(current.endDate);
      endDate.setMonth(endDate.getMonth() - 1);
      
      return { startDate, endDate };
    });
  };
  
  // Navegar al mes siguiente
  const handleNextMonth = () => {
    const now = new Date();
    const nextMonth = new Date(timeRange.startDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // No permitir navegar a fechas futuras
    if (nextMonth > now) return;
    
    setTimeRange(current => {
      const startDate = new Date(current.startDate);
      startDate.setMonth(startDate.getMonth() + 1);
      
      const endDate = new Date(current.endDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      return { startDate, endDate };
    });
  };
  
  // Formatear para mostrar
  const formatMonth = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      mb: 3,
      p: 2,
      bgcolor: '#1E1E1E',
      borderRadius: 2,
      border: '1px solid #333'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={handlePreviousMonth}
          sx={{ color: 'white' }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mx: 2
        }}>
          <CalendarMonthIcon sx={{ color: 'white', mr: 1 }} />
          <Typography variant="body1" color="white">
            {formatMonth(timeRange.startDate)}
          </Typography>
        </Box>
        
        <IconButton 
          onClick={handleNextMonth}
          sx={{ color: 'white' }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
      
      <Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => setTimeRange(getCurrentMonth())}
          sx={{ 
            mr: 1,
            bgcolor: '#4477CE',
            '&:hover': { bgcolor: '#3366BB' }
          }}
        >
          Mes Actual
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          onClick={() => setTimeRange(getPreviousMonth())}
          sx={{ 
            color: 'white',
            borderColor: '#555',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Mes Anterior
        </Button>
      </Box>
    </Box>
  );
};

export default DateRangeSelector;