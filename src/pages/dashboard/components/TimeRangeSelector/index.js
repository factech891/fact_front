// src/pages/dashboard/components/TimeRangeSelector/index.js
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TIME_RANGES } from '../../constants/dashboardConstants';
import CustomDateRangePicker from '../CustomDateRangePicker';

const TimeRangeSelector = ({ selectedRange, customDateRange, onRangeChange, onCustomRangeChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleRangeSelect = (rangeValue) => {
    // Si selecciona personalizado, abrir el selector de fechas
    if (rangeValue === 'custom') {
      setOpenDatePicker(true);
    } else {
      onRangeChange(rangeValue);
    }
    handleClose();
  };
  
  const handleCustomRangeSelect = (range) => {
    onCustomRangeChange(range);
    onRangeChange('custom');
  };
  
  // Encontrar la etiqueta para el rango seleccionado
  const selectedRangeLabel = (() => {
    // Si es personalizado y tenemos fechas, mostrar el rango
    if (selectedRange === 'custom' && customDateRange) {
      const formatDateShort = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: '2-digit' 
        });
      };
      
      const startDate = formatDateShort(customDateRange.startDate);
      const endDate = formatDateShort(customDateRange.endDate);
      return `${startDate} - ${endDate}`;
    }
    
    // Si no, buscar la etiqueta predefinida
    return TIME_RANGES.find(r => r.value === selectedRange)?.label || 'Este mes';
  })();
  
  return (
    <>
      <Card sx={{ 
        bgcolor: '#1E1E1E', 
        borderRadius: 2,
        border: '1px solid #333',
        boxShadow: 'none',
        mb: 3
      }}>
        <CardContent sx={{ py: 1.5, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.9rem' }}>
              Período de Análisis
            </Typography>
            
            <Button
              id="time-range-button"
              aria-controls={open ? 'time-range-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              startIcon={<CalendarTodayIcon />}
              endIcon={<ArrowDropDownIcon />}
              variant="outlined"
              size="small"
              sx={{
                color: 'white',
                borderColor: '#444',
                '&:hover': {
                  borderColor: '#666',
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                },
                textTransform: 'none',
                fontSize: '0.8rem'
              }}
            >
              {selectedRangeLabel}
            </Button>
            
            <Menu
              id="time-range-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'time-range-button',
              }}
              PaperProps={{
                sx: {
                  bgcolor: '#1E1E1E',
                  color: 'white',
                  border: '1px solid #444',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)'
                }
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ px: 2, py: 0.5, color: '#AAA', display: 'block' }}
              >
                Seleccionar período
              </Typography>
              <Divider sx={{ bgcolor: '#444', my: 0.5 }} />
              
              {/* Agrupar rangos por categorías */}
              <Box sx={{ px: 2, py: 0.5 }}>
                <Typography variant="caption" color="#AAA" sx={{ fontWeight: 'bold' }}>
                  Específicos
                </Typography>
              </Box>
              {TIME_RANGES.slice(0, 6).map((range) => (
                <MenuItem 
                  key={range.value}
                  onClick={() => handleRangeSelect(range.value)}
                  selected={selectedRange === range.value}
                  sx={{
                    fontSize: '0.9rem',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(68, 119, 206, 0.15)',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'rgba(68, 119, 206, 0.25)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  {range.label}
                </MenuItem>
              ))}
              
              <Divider sx={{ bgcolor: '#444', my: 0.5 }} />
              
              <Box sx={{ px: 2, py: 0.5 }}>
                <Typography variant="caption" color="#AAA" sx={{ fontWeight: 'bold' }}>
                  Relativos
                </Typography>
              </Box>
              {TIME_RANGES.slice(6, 11).map((range) => (
                <MenuItem 
                  key={range.value}
                  onClick={() => handleRangeSelect(range.value)}
                  selected={selectedRange === range.value}
                  sx={{
                    fontSize: '0.9rem',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(68, 119, 206, 0.15)',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'rgba(68, 119, 206, 0.25)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  {range.label}
                </MenuItem>
              ))}
              
              {/* Personalizado */}
              <Divider sx={{ bgcolor: '#444', my: 0.5 }} />
              <MenuItem 
                onClick={() => handleRangeSelect('custom')}
                selected={selectedRange === 'custom'}
                sx={{
                  fontSize: '0.9rem',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(68, 119, 206, 0.15)',
                  },
                  '&.Mui-selected:hover': {
                    bgcolor: 'rgba(68, 119, 206, 0.25)',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                Personalizado
              </MenuItem>
            </Menu>
          </Box>
        </CardContent>
      </Card>
      
      {/* Selector de fechas personalizado */}
      <CustomDateRangePicker
        open={openDatePicker}
        onClose={() => setOpenDatePicker(false)}
        onSelectRange={handleCustomRangeSelect}
      />
    </>
  );
};

export default TimeRangeSelector;