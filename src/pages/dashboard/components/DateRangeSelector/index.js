// src/pages/dashboard/components/DateRangeSelector/index.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DateRangeSelector = ({ onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Usar useRef para evitar que la notificación inicial cause un bucle
  const isInitialMount = useRef(true);

  // Actualizar solo cuando cambia currentMonth, y no en el montaje inicial
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (onChange) {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      onChange({ startDate, endDate });
    }
  }, [currentMonth]); // Solo depende de currentMonth, no de onChange

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      mb: 3,
      bgcolor: '#1E1E1E',
      borderRadius: 2,
      p: 2,
      border: '1px solid #333'
    }}>
      <Button 
        onClick={prevMonth}
        sx={{ color: 'white', minWidth: 'auto', p: 1 }}
      >
        <ArrowBackIcon />
      </Button>
      
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        px: 2
      }}>
        <CalendarTodayIcon sx={{ color: '#4477CE', mr: 1, fontSize: 18 }} />
        <Typography variant="h6" sx={{ color: 'white', textTransform: 'capitalize' }}>
          {formatMonth(currentMonth)}
        </Typography>
      </Box>
      
      <Button 
        onClick={nextMonth}
        sx={{ color: 'white', minWidth: 'auto', p: 1 }}
      >
        <ArrowForwardIcon />
      </Button>
    </Box>
  );
};

export default DateRangeSelector;