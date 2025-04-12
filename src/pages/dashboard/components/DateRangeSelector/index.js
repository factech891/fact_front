import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DateRangeSelector = ({ onChange }) => {
  // Usamos directamente la fecha local del navegador
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (onChange) {
      // Crear fechas en zona horaria local
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      onChange({ startDate, endDate });
    }
  }, [currentMonth]);

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